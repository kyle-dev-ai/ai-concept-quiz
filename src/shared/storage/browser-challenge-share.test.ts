import { afterEach, describe, expect, it, vi } from 'vitest'
import { sampleQuestions } from '../../content/sample-questions'
import { BrowserChallengeShare } from './browser-challenge-share'

function setClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
}

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('BrowserChallengeShare', () => {
  it('공유 URL에서 query와 hash를 빼고 복사한다', async () => {
    const writeText = vi.fn(async () => undefined)
    setClipboard(writeText)
    window.history.replaceState({}, '', '/study?draft=private#answer')

    await expect(new BrowserChallengeShare().share(sampleQuestions[0])).resolves.toBe('copied')
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('http://localhost:3000/study'))
    expect(writeText).not.toHaveBeenCalledWith(expect.stringContaining('draft=private'))
    expect(writeText).not.toHaveBeenCalledWith(expect.stringContaining('#answer'))
  })

  it('clipboard 권한이 거부되면 예외 대신 unavailable을 반환한다', async () => {
    setClipboard(async () => {
      throw new DOMException('denied', 'NotAllowedError')
    })

    await expect(new BrowserChallengeShare().share(sampleQuestions[0])).resolves.toBe('unavailable')
  })
})
