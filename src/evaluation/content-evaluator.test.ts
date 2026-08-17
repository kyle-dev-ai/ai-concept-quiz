import { describe, expect, it } from 'vitest'
import { sampleQuestions } from '../content/sample-questions'
import { type ContentEvalManifest, evaluateContent, type GoldenCase } from './content-evaluator'

const manifest: ContentEvalManifest = {
  schemaVersion: '1.0.0',
  suiteId: 'test-suite',
  datasetVersion: '1.0.0',
  capability: 'AI 개념 학습 콘텐츠 품질',
  locale: 'ko-KR',
  timeZone: 'Asia/Seoul',
  expectedQuestionCount: 185,
  expectedCategories: ['math', 'ml', 'dl', 'transformer', 'llm', 'rag', 'agent', 'ai-system'],
  repetitions: 1,
  graders: [{ id: 'content-contract', version: '1.0.0', kind: 'deterministic' }],
  thresholds: {
    questionContractPassRate: 1,
    goldenCasePassRate: 1,
    categoryCoverageRate: 1,
  },
}

const goldenCase: GoldenCase = {
  schemaVersion: '1.0.0',
  id: 'math-dot-product-contract',
  suite: 'regression',
  risk: 'high',
  slices: ['ko-KR', 'math', 'foundation'],
  questionId: 'math-vector-dot-product',
  provenance: {
    kind: 'synthetic-curated',
    source: 'test fixture',
    containsPii: false,
  },
  expected: {
    category: 'math',
    difficulty: 'foundation',
    requiredConcepts: [{ name: 'dot-product', anyOf: ['대응 원소를 곱해 더한 값'] }],
    forbiddenPhrases: ['두 벡터를 단순히 더한 값'],
  },
}

describe('evaluateContent', () => {
  it('현재 콘텐츠가 결정론적 contract와 golden case를 통과한다', () => {
    const report = evaluateContent(manifest, [goldenCase], sampleQuestions)

    expect(report.verdict).toBe('GO')
    expect(report.metrics.questionContractPassRate).toBe(1)
    expect(report.metrics.goldenCasePassRate).toBe(1)
  })

  it('golden case의 금지된 오개념을 회귀로 탐지한다', () => {
    const brokenQuestions = sampleQuestions.map((question) =>
      question.id === goldenCase.questionId
        ? { ...question, deepAnswer: `${question.deepAnswer} 두 벡터를 단순히 더한 값` }
        : question,
    )
    const report = evaluateContent(manifest, [goldenCase], brokenQuestions)

    expect(report.verdict).toBe('NO-GO')
    expect(report.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'FORBIDDEN_PHRASE_FOUND' })]),
    )
  })

  it('존재하지 않는 prerequisite 참조를 contract 위반으로 탐지한다', () => {
    const brokenQuestions = sampleQuestions.map((question) =>
      question.id === goldenCase.questionId
        ? { ...question, prerequisites: ['missing-question'] }
        : question,
    )
    const report = evaluateContent(manifest, [goldenCase], brokenQuestions)

    expect(report.verdict).toBe('NO-GO')
    expect(report.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'MISSING_PREREQUISITE' })]),
    )
  })

  it('prerequisite graph의 순환을 탐지한다', () => {
    const brokenQuestions = sampleQuestions.map((question) => {
      if (question.id === 'math-vector-dot-product') {
        return { ...question, prerequisites: ['math-gradient-partial-derivative'] }
      }
      return question
    })
    const report = evaluateContent(manifest, [goldenCase], brokenQuestions)

    expect(report.verdict).toBe('NO-GO')
    expect(report.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'PREREQUISITE_CYCLE' })]),
    )
  })
})
