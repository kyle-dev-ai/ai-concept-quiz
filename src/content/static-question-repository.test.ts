import { describe, expect, it, vi } from 'vitest'
import { sampleQuestions } from './sample-questions'
import { StaticQuestionRepository } from './static-question-repository'

describe('StaticQuestionRepository', () => {
  it('versioned asset을 browser cache 우선으로 읽는다', async () => {
    const fetchQuestionBank = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => sampleQuestions,
    }))
    const repository = new StaticQuestionRepository(
      fetchQuestionBank,
      '/generated/question-bank.1.10.0.json',
    )

    await expect(repository.list()).resolves.toHaveLength(204)
    expect(fetchQuestionBank).toHaveBeenCalledWith('/generated/question-bank.1.10.0.json', {
      cache: 'force-cache',
    })
  })

  it('asset 응답 실패를 사용자 화면에서 처리할 오류로 바꾼다', async () => {
    const repository = new StaticQuestionRepository(
      async () => ({ ok: false, status: 503, json: async () => null }),
      '/question-bank.json',
    )

    await expect(repository.list()).rejects.toThrow('질문 데이터를 불러오지 못했습니다. (503)')
  })

  it('형식이 깨진 asset을 거부한다', async () => {
    const repository = new StaticQuestionRepository(
      async () => ({ ok: true, status: 200, json: async () => [{ id: 'broken' }] }),
      '/question-bank.json',
    )

    await expect(repository.list()).rejects.toThrow('질문 데이터 형식이 올바르지 않습니다.')
  })
})
