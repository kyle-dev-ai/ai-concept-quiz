import type { ChallengeShare, ShareResult } from '../../application/ports/challenge-share'
import type { StudyQuestion } from '../../domain/learning/question'

function challengeText(question: StudyQuestion): string {
  return `10초 안에 설명할 수 있어?\n\nQ. ${question.prompt}\n\n어텐션! AI 개념 퀴즈`
}

function currentShareUrl(): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  return url.toString()
}

export class BrowserChallengeShare implements ChallengeShare {
  public async share(question: StudyQuestion): Promise<ShareResult> {
    const text = challengeText(question)
    const url = currentShareUrl()

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: '어텐션! 오늘의 10초 구술',
          text,
          url,
        })
        return 'shared'
      } catch (error) {
        return error instanceof DOMException && error.name === 'AbortError'
          ? 'cancelled'
          : 'unavailable'
      }
    }

    if (typeof navigator.clipboard?.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        return 'copied'
      } catch {
        return 'unavailable'
      }
    }

    return 'unavailable'
  }
}
