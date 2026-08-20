export interface DailyQuote {
  readonly id: string
  readonly text: string
  readonly author: string
  /** 출처가 되는 저작. 구전으로만 전해지는 말은 비워 둔다. */
  readonly source?: string
}

/**
 * 날짜로 정해지는 오늘의 문장.
 *
 * 같은 날에는 언제 열어도 같은 문장이 나오고, 목록이 한 바퀴 도는 데
 * 문장 수만큼의 날이 걸린다. `getDailyQuestion`과 같은 방식이다.
 */
export function quoteOfTheDay(
  quotes: readonly DailyQuote[],
  date = new Date(),
): DailyQuote | undefined {
  if (quotes.length === 0) {
    return undefined
  }

  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const hash = [...dateKey].reduce((value, character) => value * 31 + character.charCodeAt(0), 11)
  return quotes[Math.abs(hash) % quotes.length]
}
