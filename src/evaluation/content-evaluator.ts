import type { StudyQuestion } from '../domain/learning/question'

export type EvalSuite = 'development' | 'regression' | 'challenge'
export type EvalRisk = 'low' | 'medium' | 'high'
export type EvalVerdict = 'GO' | 'NO-GO' | 'INSUFFICIENT EVIDENCE'

export interface ContentEvalManifest {
  readonly schemaVersion: string
  readonly suiteId: string
  readonly datasetVersion: string
  readonly capability: string
  readonly locale: string
  readonly timeZone: string
  readonly expectedQuestionCount: number
  readonly expectedCategories: readonly string[]
  readonly repetitions: 1
  readonly graders: readonly {
    readonly id: string
    readonly version: string
    readonly kind: 'deterministic'
  }[]
  readonly thresholds: {
    readonly questionContractPassRate: number
    readonly goldenCasePassRate: number
    readonly categoryCoverageRate: number
  }
}

export interface GoldenCase {
  readonly schemaVersion: string
  readonly id: string
  readonly suite: EvalSuite
  readonly risk: EvalRisk
  readonly slices: readonly string[]
  readonly questionId: string
  readonly provenance: {
    readonly kind: 'synthetic-curated' | 'user-provided-redacted'
    readonly source: string
    readonly containsPii: boolean
  }
  readonly expected: {
    readonly category: string
    readonly difficulty: string
    readonly requiredConcepts: readonly {
      readonly name: string
      readonly anyOf: readonly string[]
    }[]
    readonly forbiddenPhrases: readonly string[]
    readonly prerequisiteIds?: readonly string[]
  }
}

export interface EvalFailure {
  readonly scope: 'contract' | 'golden'
  readonly code: string
  readonly message: string
  readonly questionId?: string
  readonly caseId?: string
}

export interface ContentEvalReport {
  readonly verdict: EvalVerdict
  readonly suiteId: string
  readonly datasetVersion: string
  readonly deterministic: true
  readonly repetitions: 1
  readonly harnessErrors: readonly string[]
  readonly failures: readonly EvalFailure[]
  readonly metrics: {
    readonly questionCount: number
    readonly questionContractPassRate: number
    readonly goldenCaseCount: number
    readonly goldenCasePassRate: number
    readonly categoryCoverageRate: number
    readonly passAt1: number
    readonly passPower1: number
  }
  readonly suites: Readonly<Record<EvalSuite, { readonly passed: number; readonly total: number }>>
}

const validCategories = new Set([
  'math',
  'ml',
  'dl',
  'transformer',
  'llm',
  'rag',
  'agent',
  'ai-system',
])
const validDifficulties = new Set(['foundation', 'intermediate', 'advanced'])
const validSuites = new Set<EvalSuite>(['development', 'regression', 'challenge'])
const unsafeContentPatterns = [/<script\b/i, /javascript\s*:/i]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown, minimumLength = 1): value is string {
  return typeof value === 'string' && value.trim().length >= minimumLength
}

function normalize(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim()
}

function validateHarnessInputs(
  manifest: ContentEvalManifest,
  cases: readonly GoldenCase[],
): string[] {
  const errors: string[] = []

  if (!isNonEmptyString(manifest.schemaVersion) || !isNonEmptyString(manifest.suiteId)) {
    errors.push('manifest schemaVersion과 suiteId가 필요합니다.')
  }
  if (!Number.isInteger(manifest.expectedQuestionCount) || manifest.expectedQuestionCount < 1) {
    errors.push('manifest expectedQuestionCount는 1 이상의 정수여야 합니다.')
  }
  if (manifest.repetitions !== 1) {
    errors.push('현재 deterministic content harness의 repetitions는 1이어야 합니다.')
  }
  if (cases.length === 0) {
    errors.push('최소 한 개의 golden case가 필요합니다.')
  }

  const caseIds = new Set<string>()
  for (const goldenCase of cases) {
    if (!isNonEmptyString(goldenCase.id) || caseIds.has(goldenCase.id)) {
      errors.push(`golden case ID가 비었거나 중복되었습니다: ${goldenCase.id}`)
    }
    caseIds.add(goldenCase.id)

    if (!validSuites.has(goldenCase.suite)) {
      errors.push(`${goldenCase.id}: 지원하지 않는 suite입니다.`)
    }
    if (goldenCase.provenance.containsPii) {
      errors.push(`${goldenCase.id}: MVP golden set에는 PII를 넣을 수 없습니다.`)
    }
    if (goldenCase.expected.requiredConcepts.length === 0) {
      errors.push(`${goldenCase.id}: 하나 이상의 required concept가 필요합니다.`)
    }
  }

  return errors
}

function validateQuestionContracts(
  rawQuestions: readonly unknown[],
  manifest: ContentEvalManifest,
): { readonly questions: readonly StudyQuestion[]; readonly failures: readonly EvalFailure[] } {
  const failures: EvalFailure[] = []
  const questions: StudyQuestion[] = []

  for (const [index, rawQuestion] of rawQuestions.entries()) {
    if (!isRecord(rawQuestion)) {
      failures.push({
        scope: 'contract',
        code: 'QUESTION_NOT_OBJECT',
        message: `index ${index}의 질문이 object가 아닙니다.`,
      })
      continue
    }

    const questionId = typeof rawQuestion.id === 'string' ? rawQuestion.id : `index-${index}`
    let isValid = true
    const fail = (code: string, message: string) => {
      isValid = false
      failures.push({ scope: 'contract', code, message, questionId })
    }

    if (!isNonEmptyString(rawQuestion.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawQuestion.id)) {
      fail('INVALID_ID', 'id는 kebab-case 비어 있지 않은 문자열이어야 합니다.')
    }
    if (typeof rawQuestion.category !== 'string' || !validCategories.has(rawQuestion.category)) {
      fail('INVALID_CATEGORY', '지원하는 category가 아닙니다.')
    }
    if (
      typeof rawQuestion.difficulty !== 'string' ||
      !validDifficulties.has(rawQuestion.difficulty)
    ) {
      fail('INVALID_DIFFICULTY', '지원하는 difficulty가 아닙니다.')
    }

    const textRequirements = [
      ['term', 2],
      ['prompt', 10],
      ['shortAnswer', 20],
      ['deepAnswer', 20],
      ['followUp', 10],
    ] as const
    for (const [field, minimumLength] of textRequirements) {
      if (!isNonEmptyString(rawQuestion[field], minimumLength)) {
        fail('INVALID_TEXT_FIELD', `${field}는 최소 ${minimumLength}자여야 합니다.`)
      }
    }

    if (
      !Array.isArray(rawQuestion.keyPoints) ||
      rawQuestion.keyPoints.length < 2 ||
      !rawQuestion.keyPoints.every((point) => isNonEmptyString(point, 4))
    ) {
      fail('INVALID_KEY_POINTS', 'keyPoints에는 4자 이상의 항목이 두 개 이상 필요합니다.')
    }
    if (
      !Array.isArray(rawQuestion.prerequisites) ||
      !rawQuestion.prerequisites.every((id) => isNonEmptyString(id))
    ) {
      fail('INVALID_PREREQUISITES', 'prerequisites는 문자열 배열이어야 합니다.')
    }

    const allText = Object.values(rawQuestion)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === 'string')
      .join(' ')
    if (unsafeContentPatterns.some((pattern) => pattern.test(allText))) {
      fail('UNSAFE_MARKUP', '실행 가능한 markup 또는 javascript URL을 포함할 수 없습니다.')
    }

    if (isValid) {
      questions.push(rawQuestion as unknown as StudyQuestion)
    }
  }

  if (rawQuestions.length !== manifest.expectedQuestionCount) {
    failures.push({
      scope: 'contract',
      code: 'UNEXPECTED_QUESTION_COUNT',
      message: `질문 수 ${rawQuestions.length}개가 manifest 기준 ${manifest.expectedQuestionCount}개와 다릅니다.`,
    })
  }

  const ids = new Set<string>()
  const prompts = new Set<string>()
  for (const question of questions) {
    if (ids.has(question.id)) {
      failures.push({
        scope: 'contract',
        code: 'DUPLICATE_ID',
        message: '중복 질문 ID입니다.',
        questionId: question.id,
      })
    }
    ids.add(question.id)

    const normalizedPrompt = normalize(question.prompt)
    if (prompts.has(normalizedPrompt)) {
      failures.push({
        scope: 'contract',
        code: 'DUPLICATE_PROMPT',
        message: '정규화했을 때 같은 prompt가 존재합니다.',
        questionId: question.id,
      })
    }
    prompts.add(normalizedPrompt)
  }

  const usedCategories = new Set(questions.map((question) => question.category))
  for (const category of manifest.expectedCategories) {
    if (!usedCategories.has(category as StudyQuestion['category'])) {
      failures.push({
        scope: 'contract',
        code: 'MISSING_CATEGORY',
        message: `${category} 카테고리에 질문이 없습니다.`,
      })
    }
  }

  for (const question of questions) {
    for (const prerequisite of question.prerequisites) {
      if (prerequisite === question.id) {
        failures.push({
          scope: 'contract',
          code: 'SELF_PREREQUISITE',
          message: '질문이 자기 자신을 prerequisite로 참조합니다.',
          questionId: question.id,
        })
      } else if (!ids.has(prerequisite)) {
        failures.push({
          scope: 'contract',
          code: 'MISSING_PREREQUISITE',
          message: `존재하지 않는 prerequisite를 참조합니다: ${prerequisite}`,
          questionId: question.id,
        })
      }
    }
  }

  const questionById = new Map(questions.map((question) => [question.id, question]))
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const reportedCycles = new Set<string>()

  function visit(questionId: string, path: readonly string[]) {
    if (visiting.has(questionId)) {
      const cycleStart = path.indexOf(questionId)
      const cycle = [...path.slice(cycleStart), questionId]
      const cycleKey = [...new Set(cycle)].sort().join('|')
      if (!reportedCycles.has(cycleKey)) {
        reportedCycles.add(cycleKey)
        failures.push({
          scope: 'contract',
          code: 'PREREQUISITE_CYCLE',
          message: `prerequisite 순환이 있습니다: ${cycle.join(' → ')}`,
          questionId,
        })
      }
      return
    }
    if (visited.has(questionId)) {
      return
    }

    visiting.add(questionId)
    const question = questionById.get(questionId)
    for (const prerequisite of question?.prerequisites ?? []) {
      if (questionById.has(prerequisite)) {
        visit(prerequisite, [...path, questionId])
      }
    }
    visiting.delete(questionId)
    visited.add(questionId)
  }

  for (const question of questions) {
    visit(question.id, [])
  }

  return { questions, failures }
}

function gradeGoldenCases(
  questions: readonly StudyQuestion[],
  cases: readonly GoldenCase[],
): {
  readonly failures: readonly EvalFailure[]
  readonly suites: Readonly<Record<EvalSuite, { readonly passed: number; readonly total: number }>>
} {
  const failures: EvalFailure[] = []
  const questionById = new Map(questions.map((question) => [question.id, question]))
  const mutableSuites: Record<EvalSuite, { passed: number; total: number }> = {
    development: { passed: 0, total: 0 },
    regression: { passed: 0, total: 0 },
    challenge: { passed: 0, total: 0 },
  }

  for (const goldenCase of cases) {
    mutableSuites[goldenCase.suite].total += 1
    const question = questionById.get(goldenCase.questionId)
    const caseFailures: EvalFailure[] = []
    const fail = (code: string, message: string) => {
      caseFailures.push({
        scope: 'golden',
        code,
        message,
        questionId: goldenCase.questionId,
        caseId: goldenCase.id,
      })
    }

    if (question === undefined) {
      fail('QUESTION_NOT_FOUND', 'golden case가 참조하는 질문이 없습니다.')
    } else {
      if (question.category !== goldenCase.expected.category) {
        fail('CATEGORY_MISMATCH', `category가 ${goldenCase.expected.category}여야 합니다.`)
      }
      if (question.difficulty !== goldenCase.expected.difficulty) {
        fail('DIFFICULTY_MISMATCH', `difficulty가 ${goldenCase.expected.difficulty}여야 합니다.`)
      }

      const corpus = normalize(
        [
          question.term,
          question.prompt,
          question.shortAnswer,
          question.deepAnswer,
          ...question.keyPoints,
          question.followUp,
        ].join(' '),
      )

      for (const concept of goldenCase.expected.requiredConcepts) {
        if (!concept.anyOf.some((phrase) => corpus.includes(normalize(phrase)))) {
          fail(
            'REQUIRED_CONCEPT_MISSING',
            `${concept.name} 개념을 뒷받침하는 표현이 없습니다: ${concept.anyOf.join(' | ')}`,
          )
        }
      }
      for (const phrase of goldenCase.expected.forbiddenPhrases) {
        if (corpus.includes(normalize(phrase))) {
          fail('FORBIDDEN_PHRASE_FOUND', `금지된 오개념 표현이 있습니다: ${phrase}`)
        }
      }
      for (const prerequisite of goldenCase.expected.prerequisiteIds ?? []) {
        if (!question.prerequisites.includes(prerequisite)) {
          fail('EXPECTED_PREREQUISITE_MISSING', `필수 prerequisite가 없습니다: ${prerequisite}`)
        }
      }
    }

    failures.push(...caseFailures)
    if (caseFailures.length === 0) {
      mutableSuites[goldenCase.suite].passed += 1
    }
  }

  return { failures, suites: mutableSuites }
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator
}

export function evaluateContent(
  manifest: ContentEvalManifest,
  cases: readonly GoldenCase[],
  rawQuestions: readonly unknown[],
): ContentEvalReport {
  const harnessErrors = validateHarnessInputs(manifest, cases)
  const contract = validateQuestionContracts(rawQuestions, manifest)
  const golden = gradeGoldenCases(contract.questions, cases)
  const contractFailedIds = new Set(
    contract.failures.flatMap((failure) =>
      failure.questionId === undefined ? [] : [failure.questionId],
    ),
  )
  const questionContractPassRate = contract.failures.some(
    (failure) => failure.questionId === undefined,
  )
    ? 0
    : ratio(rawQuestions.length - contractFailedIds.size, rawQuestions.length)
  const failedCaseIds = new Set(
    golden.failures.flatMap((failure) => (failure.caseId === undefined ? [] : [failure.caseId])),
  )
  const goldenCasePassRate = ratio(cases.length - failedCaseIds.size, cases.length)
  const usedCategories = new Set(contract.questions.map((question) => question.category))
  const coveredCategoryCount = manifest.expectedCategories.filter((category) =>
    usedCategories.has(category as StudyQuestion['category']),
  ).length
  const categoryCoverageRate = ratio(coveredCategoryCount, manifest.expectedCategories.length)
  const failures = [...contract.failures, ...golden.failures]

  const meetsThresholds =
    questionContractPassRate >= manifest.thresholds.questionContractPassRate &&
    goldenCasePassRate >= manifest.thresholds.goldenCasePassRate &&
    categoryCoverageRate >= manifest.thresholds.categoryCoverageRate &&
    failures.length === 0

  return {
    verdict: harnessErrors.length > 0 ? 'INSUFFICIENT EVIDENCE' : meetsThresholds ? 'GO' : 'NO-GO',
    suiteId: manifest.suiteId,
    datasetVersion: manifest.datasetVersion,
    deterministic: true,
    repetitions: 1,
    harnessErrors,
    failures,
    metrics: {
      questionCount: rawQuestions.length,
      questionContractPassRate,
      goldenCaseCount: cases.length,
      goldenCasePassRate,
      categoryCoverageRate,
      passAt1: goldenCasePassRate,
      passPower1: goldenCasePassRate,
    },
    suites: golden.suites,
  }
}
