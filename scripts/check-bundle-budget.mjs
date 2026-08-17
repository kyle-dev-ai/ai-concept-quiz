import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { gzipSync } from 'node:zlib'

const kibibyte = 1024
const budgets = Object.freeze({
  initialJavaScriptGzip: 125 * kibibyte,
  requiredJavaScriptGzip: 125 * kibibyte,
  totalJavaScriptGzip: 300 * kibibyte,
  cssGzip: 12 * kibibyte,
  // 질문 은행은 initial JS와 분리된 versioned asset이고 force-cache로 한 번만 받는다.
  // dataset 1.3.0(162문항)에서 55 KiB가 되어 48에서 올렸다.
  // 200문항을 넘기기 전에 카테고리별 분할 로딩을 검토한다.
  questionBankGzip: 64 * kibibyte,
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
  const filePath = join(directory, questionBankRelativePath)
  const content = JSON.parse(readFileSync(filePath, 'utf8'))
  const compressedSize = gzipSize(filePath)

  console.info(
    `${label} question bank: ${content.length} questions, ${formatKibibytes(compressedSize)} gzip`,
  )

  if (!Array.isArray(content) || content.length !== evalManifest.expectedQuestionCount) {
    fail(
      `${label} question bank가 manifest 기준 ${evalManifest.expectedQuestionCount}개와 다릅니다.`,
    )
  }
  if (compressedSize > budgets.questionBankGzip) {
    fail(`${label} question bank gzip이 ${formatKibibytes(budgets.questionBankGzip)}를 넘었습니다.`)
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
