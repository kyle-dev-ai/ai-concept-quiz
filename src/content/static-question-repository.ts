import type { QuestionRepository } from '../application/ports/question-repository'
import { categoryIds, type Difficulty, type StudyQuestion } from '../domain/learning/question'
import { resolveQuestionBankUrl } from './question-bank-metadata'

interface QuestionBankResponse {
  readonly ok: boolean
  readonly status: number
  json(): Promise<unknown>
}

type FetchQuestionBank = (
  url: string,
  init: { readonly cache: 'force-cache' },
) => Promise<QuestionBankResponse>

const difficulties: readonly Difficulty[] = ['foundation', 'intermediate', 'advanced']

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isStudyQuestion(value: unknown): value is StudyQuestion {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const question = value as Record<string, unknown>
  return (
    typeof question.id === 'string' &&
    typeof question.category === 'string' &&
    categoryIds.includes(question.category as StudyQuestion['category']) &&
    typeof question.difficulty === 'string' &&
    difficulties.includes(question.difficulty as Difficulty) &&
    typeof question.term === 'string' &&
    typeof question.prompt === 'string' &&
    typeof question.shortAnswer === 'string' &&
    typeof question.deepAnswer === 'string' &&
    typeof question.followUp === 'string' &&
    isStringArray(question.keyPoints) &&
    question.keyPoints.length >= 2 &&
    isStringArray(question.prerequisites)
  )
}

function parseQuestionBank(value: unknown): readonly StudyQuestion[] {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isStudyQuestion)) {
    throw new Error('질문 데이터 형식이 올바르지 않습니다.')
  }

  return value
}

export class StaticQuestionRepository implements QuestionRepository {
  private readonly fetchQuestionBank: FetchQuestionBank
  private readonly questionBankUrl: string

  public constructor(
    fetchQuestionBank: FetchQuestionBank = globalThis.fetch.bind(globalThis),
    questionBankUrl = resolveQuestionBankUrl(import.meta.env.BASE_URL),
  ) {
    this.fetchQuestionBank = fetchQuestionBank
    this.questionBankUrl = questionBankUrl
  }

  public async list(): Promise<readonly StudyQuestion[]> {
    const response = await this.fetchQuestionBank(this.questionBankUrl, { cache: 'force-cache' })
    if (!response.ok) {
      throw new Error(`질문 데이터를 불러오지 못했습니다. (${response.status})`)
    }

    return parseQuestionBank(await response.json())
  }
}
