import { describe, expect, it } from 'vitest'
import { type DailyQuote, quoteOfTheDay } from './quote'

const sample: DailyQuote[] = [
  { id: 'a', text: '가', author: '갑' },
  { id: 'b', text: '나', author: '을' },
  { id: 'c', text: '다', author: '병' },
]

describe('quoteOfTheDay', () => {
  it('같은 날에는 언제 열어도 같은 문장을 준다', () => {
    const morning = quoteOfTheDay(sample, new Date(2026, 7, 21, 8))
    const night = quoteOfTheDay(sample, new Date(2026, 7, 21, 23))

    expect(morning?.id).toBe(night?.id)
  })

  it('날이 바뀌면 문장도 바뀐다', () => {
    const ids = new Set(
      Array.from(
        { length: 6 },
        (_, offset) => quoteOfTheDay(sample, new Date(2026, 7, 21 + offset))?.id,
      ),
    )

    expect(ids.size).toBeGreaterThan(1)
  })

  it('목록이 비면 아무것도 주지 않는다', () => {
    expect(quoteOfTheDay([], new Date())).toBeUndefined()
  })
})
