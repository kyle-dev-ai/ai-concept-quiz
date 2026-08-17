import { describe, expect, it } from 'vitest'
import { categoryIds } from '../domain/learning/question'
import { sampleQuestions } from './sample-questions'

describe('sampleQuestions', () => {
  it('162개의 중복 없는 질문 ID를 제공한다', () => {
    const ids = sampleQuestions.map((question) => question.id)

    expect(sampleQuestions).toHaveLength(162)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('공백과 대소문자를 정규화해도 같은 질문이나 용어가 없다', () => {
    const normalize = (value: string) =>
      value.toLocaleLowerCase('ko-KR').replaceAll(/\s+/g, ' ').trim()
    const prompts = sampleQuestions.map((question) => normalize(question.prompt))
    const terms = sampleQuestions.map((question) => normalize(question.term))

    expect(new Set(prompts).size).toBe(prompts.length)
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('모든 MVP 카테고리에 질문이 있다', () => {
    const usedCategories = new Set(sampleQuestions.map((question) => question.category))

    expect(categoryIds.every((category) => usedCategories.has(category))).toBe(true)
  })

  it('입시 핵심 범위를 의도한 카테고리 비율로 유지한다', () => {
    const categoryCounts = Object.fromEntries(
      categoryIds.map((category) => [
        category,
        sampleQuestions.filter((question) => question.category === category).length,
      ]),
    )

    expect(categoryCounts).toEqual({
      math: 21,
      ml: 25,
      dl: 21,
      transformer: 19,
      llm: 22,
      rag: 18,
      agent: 19,
      'ai-system': 17,
    })
  })

  it('각 질문에 답과 두 개 이상의 핵심 포인트가 있다', () => {
    for (const question of sampleQuestions) {
      expect(question.prompt.length).toBeGreaterThan(10)
      expect(question.shortAnswer.length).toBeGreaterThan(20)
      expect(question.deepAnswer.length).toBeGreaterThan(20)
      expect(question.keyPoints.length).toBeGreaterThanOrEqual(2)
    }
  })
})
