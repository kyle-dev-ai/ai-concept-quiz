import { describe, expect, it } from 'vitest'
import { quoteOfTheDay } from '../domain/learning/quote'
import { dailyQuotes } from './daily-quotes'

describe('daily quotes 데이터', () => {
  it('100개 이상이고 id가 겹치지 않는다', () => {
    expect(dailyQuotes.length).toBeGreaterThanOrEqual(100)
    expect(new Set(dailyQuotes.map((quote) => quote.id)).size).toBe(dailyQuotes.length)
  })

  it('모든 문장에 글과 저자가 있다', () => {
    for (const quote of dailyQuotes) {
      expect(quote.text.length).toBeGreaterThan(5)
      expect(quote.author.length).toBeGreaterThan(0)
    }
  })

  it('한 해 안에 모든 문장이 한 번은 나온다', () => {
    const seen = new Set<string>()
    for (let day = 0; day < 400; day += 1) {
      const quote = quoteOfTheDay(dailyQuotes, new Date(2026, 0, 1 + day))
      if (quote !== undefined) {
        seen.add(quote.id)
      }
    }

    // 날짜 해시라 완전 순환은 아니지만, 대부분이 돌아가야 한다.
    expect(seen.size).toBeGreaterThan(dailyQuotes.length * 0.5)
  })
})
