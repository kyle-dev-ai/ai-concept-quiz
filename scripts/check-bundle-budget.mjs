import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { gzipSync } from 'node:zlib'

const kibibyte = 1024
const budgets = Object.freeze({
  initialJavaScriptGzip: 125 * kibibyte,
  requiredJavaScriptGzip: 125 * kibibyte,
  totalJavaScriptGzip: 300 * kibibyte,
  // CSS는 렌더를 막는 단일 stylesheet다. 2026-08-21 재방문 장치(오늘 목표 링, 학습 달력,
  // 카운트다운 강조, 레벨업 축하, 설정 스위치)가 들어오며 12 KiB를 넘겨 13으로 올렸다.
  // 다음에 또 닿으면 예산을 올리지 말고 화면별로 분할하거나 쓰이지 않는 규칙을 걷어낸다.
  cssGzip: 13 * kibibyte,
  // 질문 은행은 initial JS와 분리된 versioned asset이고 force-cache로 한 번만 받는다.
  // 콘텐츠가 늘어 총량이 커지는 것은 의도된 변화라 총량만으로 막으면 매번 예산을 올리게 된다.
  // 그래서 첫 로딩이 실제로 문제가 되는 지점을 절대 상한으로 두고,
  // 문항당 평균으로 개별 문항이 비대해지는 회귀를 따로 잡는다.
  // 절대 상한에 닿으면 그때는 예산을 올리지 말고 카테고리별 분할 로딩을 도입한다.
  questionBankGzip: 128 * kibibyte,
  questionBankGzipPerQuestion: 0.42 * kibibyte,
  appsPackage: 1 * 1024 * kibibyte,
})
const evalManifest = JSON.parse(readFileSync('assets/evals/eval-manifest.v1.json', 'utf8'))
const questionBankRelativePath = `generated/question-bank.${evalManifest.datasetVersion}.json`

function fail(message) {
  console.error(`BUNDLE BUDGET FAIL: ${message}`)
  process.exitCode = 1
}

function gzipSize(filePath) {
  return gzipSync(readFileSync(filePath)).byteLength
}

function assetFiles(directory, extension) {
  const assetsDirectory = join(directory, 'assets')
  return readdirSync(assetsDirectory)
    .filter((fileName) => fileName.endsWith(extension))
    .map((fileName) => join(assetsDirectory, fileName))
}

function formatKibibytes(bytes) {
  return `${(bytes / kibibyte).toFixed(2)} KiB`
}

function inspectBuild(label, directory) {
  const html = readFileSync(join(directory, 'index.html'), 'utf8')
  const javascript = assetFiles(directory, '.js')
  const stylesheets = assetFiles(directory, '.css')
  const initialReferences = new Set(
    [...html.matchAll(/(?:src|href)="\/?(assets\/[^"?]+\.js)"/g)]
      .map((match) => match[1])
      .filter((fileName) => fileName !== undefined),
  )
  const monitoringPattern = /(?:monitoring-sentry|sentry-telemetry)-/
  const initialJavaScript = javascript.filter((filePath) =>
    initialReferences.has(`assets/${basename(filePath)}`),
  )
  const requiredJavaScript = javascript.filter(
    (filePath) => !monitoringPattern.test(basename(filePath)),
  )
  const initialJavaScriptGzip = initialJavaScript.reduce(
    (total, filePath) => total + gzipSize(filePath),
    0,
  )
  const requiredJavaScriptGzip = requiredJavaScript.reduce(
    (total, filePath) => total + gzipSize(filePath),
    0,
  )
  const totalJavaScriptGzip = javascript.reduce((total, filePath) => total + gzipSize(filePath), 0)
  const cssGzip = stylesheets.reduce((total, filePath) => total + gzipSize(filePath), 0)

  console.info(
    `${label}: initial JS ${formatKibibytes(initialJavaScriptGzip)}, required JS ${formatKibibytes(requiredJavaScriptGzip)}, total JS ${formatKibibytes(totalJavaScriptGzip)}, CSS ${formatKibibytes(cssGzip)}`,
  )

  if (initialJavaScript.some((filePath) => monitoringPattern.test(basename(filePath)))) {
    fail(`${label} HTML이 optional Sentry chunk를 preload합니다.`)
  }
  if (initialJavaScriptGzip > budgets.initialJavaScriptGzip) {
    fail(
      `${label} initial JavaScript gzip이 ${formatKibibytes(budgets.initialJavaScriptGzip)}를 넘었습니다.`,
    )
  }
  if (requiredJavaScriptGzip > budgets.requiredJavaScriptGzip) {
    fail(
      `${label} required JavaScript gzip이 ${formatKibibytes(budgets.requiredJavaScriptGzip)}를 넘었습니다.`,
    )
  }
  if (totalJavaScriptGzip > budgets.totalJavaScriptGzip) {
    fail(
      `${label} total JavaScript gzip이 ${formatKibibytes(budgets.totalJavaScriptGzip)}를 넘었습니다.`,
    )
  }
  if (cssGzip > budgets.cssGzip) {
    fail(`${label} CSS gzip이 ${formatKibibytes(budgets.cssGzip)}를 넘었습니다.`)
  }

  return javascript
}

function inspectQuestionBank(label, directory) {
  // 예산은 현재 버전만 재므로, 지난 버전이 남아 있으면 아무도 읽지 않는 파일이
  // 사용자에게 전송되고 service worker precache에도 들어간다.
  const bankDirectory = join(directory, 'generated')
  const currentFileName = questionBankRelativePath.split('/').at(-1)
  const strayBanks = readdirSync(bankDirectory).filter(
    (name) => /^question-bank\..+\.json$/.test(name) && name !== currentFileName,
  )
  if (strayBanks.length > 0) {
    fail(`${label}에 쓰이지 않는 지난 question bank가 있습니다: ${strayBanks.join(', ')}`)
  }

  const filePath = join(directory, questionBankRelativePath)
  const content = JSON.parse(readFileSync(filePath, 'utf8'))
  const compressedSize = gzipSize(filePath)

  const perQuestion = compressedSize / content.length

  console.info(
    `${label} question bank: ${content.length} questions, ${formatKibibytes(compressedSize)} gzip (문항당 ${formatKibibytes(perQuestion)})`,
  )

  if (!Array.isArray(content) || content.length !== evalManifest.expectedQuestionCount) {
    fail(
      `${label} question bank가 manifest 기준 ${evalManifest.expectedQuestionCount}개와 다릅니다.`,
    )
  }
  if (compressedSize > budgets.questionBankGzip) {
    fail(
      `${label} question bank gzip이 ${formatKibibytes(budgets.questionBankGzip)}를 넘었습니다. 예산을 올리지 말고 분할 로딩을 도입하세요.`,
    )
  }
  if (perQuestion > budgets.questionBankGzipPerQuestion) {
    fail(
      `${label} question bank 문항당 gzip이 ${formatKibibytes(budgets.questionBankGzipPerQuestion)}를 넘었습니다.`,
    )
  }
}

const appsJavaScript = inspectBuild('Apps in Toss', 'dist')
const standaloneJavaScript = inspectBuild('Standalone', 'dist-standalone')
inspectQuestionBank('Apps in Toss', 'dist')
inspectQuestionBank('Standalone', 'dist-standalone')
const standaloneSource = standaloneJavaScript
  .map((filePath) => readFileSync(filePath, 'utf8'))
  .join('')
const standaloneServiceWorker = readFileSync('dist-standalone/sw.js', 'utf8')

if (/apps-in-toss/i.test(standaloneSource)) {
  fail('standalone JavaScript에 Apps in Toss SDK가 포함됐습니다.')
}
if (!appsJavaScript.some((filePath) => /apps-in-toss/i.test(readFileSync(filePath, 'utf8')))) {
  fail('Apps in Toss build에서 native Storage SDK를 찾지 못했습니다.')
}
if (/(?:monitoring-sentry|sentry-telemetry)-/.test(standaloneServiceWorker)) {
  fail('standalone service worker가 optional Sentry chunk를 precache합니다.')
}
if (!standaloneServiceWorker.includes(questionBankRelativePath)) {
  fail('standalone service worker가 versioned question bank를 precache하지 않습니다.')
}

const appsPackagePath = 'ai-concept-quiz.ait'
const appsPackageSize = statSync(appsPackagePath).size
console.info(`Apps package: ${formatKibibytes(appsPackageSize)}`)
if (appsPackageSize > budgets.appsPackage) {
  fail(`.ait 크기가 ${formatKibibytes(budgets.appsPackage)}를 넘었습니다.`)
}

if (process.exitCode === undefined) {
  console.info('Bundle budgets passed.')
}
