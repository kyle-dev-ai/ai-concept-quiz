import { mkdir, readFile, writeFile } from 'node:fs/promises'
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
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(sampleQuestions)}\n`, 'utf8')

console.info(
  `Question bank ${questionBankMetadata.datasetVersion}: ${sampleQuestions.length} questions → ${questionBankMetadata.assetPath}`,
)
