import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { sampleQuestions } from '../src/content/sample-questions.ts'
import { evaluateContent } from '../src/evaluation/content-evaluator.ts'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalize(child)]),
    )
  }
  return value
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function readJsonLines(path) {
  const text = await readFile(path, 'utf8')
  return text
    .split(/\r?\n/u)
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      try {
        return JSON.parse(line)
      } catch (error) {
        throw new Error(`${path}:${index + 1} JSONL 파싱 실패`, { cause: error })
      }
    })
}

const manifestPath = resolve(
  projectRoot,
  argumentValue('--manifest') ?? 'assets/evals/eval-manifest.v1.json',
)
const casesPath = resolve(
  projectRoot,
  argumentValue('--cases') ?? 'assets/evals/golden-set.v1.jsonl',
)
const candidateArgument = argumentValue('--candidate')
const candidatePath =
  candidateArgument === undefined ? undefined : resolve(projectRoot, candidateArgument)

try {
  const manifest = await readJson(manifestPath)
  const cases = await readJsonLines(casesPath)
  const questions = candidatePath === undefined ? sampleQuestions : await readJson(candidatePath)
  const fingerprint = createHash('sha256')
    .update(JSON.stringify(canonicalize({ manifest, cases, questions })))
    .digest('hex')
  const report = evaluateContent(manifest, cases, questions)
  const output = { ...report, fingerprint }

  if (process.argv.includes('--fingerprint')) {
    console.log(fingerprint)
  } else if (process.argv.includes('--json')) {
    console.log(JSON.stringify(output, null, 2))
  } else {
    console.log(`AI content eval: ${report.verdict}`)
    console.log(`suite: ${report.suiteId} · dataset: ${report.datasetVersion}`)
    console.log(`fingerprint: ${fingerprint}`)
    console.log(
      `contracts: ${(report.metrics.questionContractPassRate * 100).toFixed(1)}% · golden: ${(report.metrics.goldenCasePassRate * 100).toFixed(1)}% · categories: ${(report.metrics.categoryCoverageRate * 100).toFixed(1)}%`,
    )
    console.log(
      `cases: ${report.metrics.goldenCaseCount} · development ${report.suites.development.passed}/${report.suites.development.total} · regression ${report.suites.regression.passed}/${report.suites.regression.total} · challenge ${report.suites.challenge.passed}/${report.suites.challenge.total}`,
    )

    for (const error of report.harnessErrors) {
      console.error(`HARNESS_ERROR: ${error}`)
    }
    for (const failure of report.failures) {
      const identity = failure.caseId ?? failure.questionId ?? 'global'
      console.error(
        `${failure.scope.toUpperCase()} ${identity} ${failure.code}: ${failure.message}`,
      )
    }
  }

  if (report.verdict !== 'GO') {
    process.exitCode = 1
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 2
}
