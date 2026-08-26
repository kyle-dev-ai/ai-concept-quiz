import { describe, expect, it } from 'vitest'
import { answerModes, isAnswerMode } from './answer-mode'

describe('isAnswerMode', () => {
  it('정의된 모드만 통과시킨다', () => {
    for (const mode of answerModes) {
      expect(isAnswerMode(mode)).toBe(true)
    }
  })

  it('저장소에서 온 알 수 없는 값은 거른다', () => {
    expect(isAnswerMode('typed')).toBe(false)
    expect(isAnswerMode(null)).toBe(false)
    expect(isAnswerMode(undefined)).toBe(false)
  })
})
