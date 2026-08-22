import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { questionBankMetadata } from '../src/content/question-bank-metadata.ts'
import { sampleQuestions } from '../src/content/sample-questions.ts'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const manifest = JSON.parse(
  await readFile(resolve(projectRoot, 'assets/evals/eval-manifest.v1.json'), 'utf8'),
)

if (manifest.datasetVersion !== questionBankMetadata.datasetVersion) {
  throw new Error(
    `question bank version ${questionBankMetadata.datasetVersion}이 eval manifest ${manifest.datasetVersion}과 다릅니다.`,
  )
}

if (manifest.expectedQuestionCount !== sampleQuestions.length) {
  throw new Error(
    `question bank count ${sampleQuestions.length}가 eval manifest ${manifest.expectedQuestionCount}과 다릅니다.`,
  )
}

const outputPath = resolve(projectRoot, 'public', questionBankMetadata.assetPath)
const outputDirectory = dirname(outputPath)
await mkdir(outputDirectory, { recursive: true })

// public/ 아래는 그대로 배포본에 복사되고 service worker가 precache한다.
// 지난 버전 은행을 남겨두면 아무도 읽지 않는 파일을 사용자가 내려받게 되므로,
// 이번 버전만 남기고 나머지 question-bank 파일은 지운다.
const currentFileName = questionBankMetadata.assetPath.split('/').at(-1)
const staleBanks = (await readdir(outputDirectory)).filter(
  (name) => /^question-bank\..+\.json$/.test(name) && name !== currentFileName,
)
for (const name of staleBanks) {
  await rm(resolve(outputDirectory, name))
}

await writeFile(outputPath, `${JSON.stringify(sampleQuestions)}\n`, 'utf8')

if (staleBanks.length > 0) {
  console.info(`지난 question bank ${staleBanks.length}개를 정리했습니다: ${staleBanks.join(', ')}`)
}

console.info(
  `Question bank ${questionBankMetadata.datasetVersion}: ${sampleQuestions.length} questions → ${questionBankMetadata.assetPath}`,
)
