import { describe, expect, it } from 'vitest'
import type { StudyQuestion } from './question'
import {
  scoreBestCandidate,
  scoreSpokenAnswer,
  similarityBand,
  textSimilarity,
} from './spoken-answer'

const question: StudyQuestion = {
  id: 'math-vector-dot-product',
  category: 'math',
  difficulty: 'foundation',
  term: 'Vector · Matrix · Dot Product',
  prompt: '벡터와 행렬은 무엇이고, 내적은 AI에서 왜 자주 쓰이나요?',
  shortAnswer:
    '벡터는 방향과 크기를 가진 값의 배열이고 행렬은 벡터를 모은 2차원 배열입니다. 내적은 두 벡터의 대응 원소를 곱해 더한 값으로, 방향의 정렬 정도나 선형 변환 결과를 계산할 때 쓰입니다.',
  deepAnswer:
    '신경망의 한 뉴런은 입력 벡터와 가중치 벡터의 내적에 bias를 더하는 것으로 볼 수 있습니다.',
  keyPoints: [
    '뉴런의 선형 결합은 입력과 가중치의 내적',
    'cosine similarity는 크기보다 방향을 비교',
  ],
  followUp: '내적이 0이라는 것은 기하학적으로 무엇을 뜻하나요?',
  prerequisites: [],
}

describe('textSimilarity', () => {
  it('같은 문장은 100을 준다', () => {
    expect(textSimilarity('내적은 방향의 정렬 정도', '내적은 방향의 정렬 정도')).toBe(100)
  })

  it('공백과 문장부호 차이는 무시한다', () => {
    expect(textSimilarity('내적은, 방향의 정렬 정도!', '내적은 방향의 정렬정도')).toBe(100)
  })

  it('겹치는 표현이 많을수록 점수가 높다', () => {
    const close = textSimilarity(
      '벡터는 방향과 크기를 가진 배열이고 내적은 대응 원소를 곱해 더한 값입니다',
      question.shortAnswer,
    )
    const far = textSimilarity('강화학습은 보상을 최대화하는 정책을 배웁니다', question.shortAnswer)

    expect(close).toBeGreaterThan(far)
    expect(far).toBeLessThan(20)
  })

  it('빈 발화는 0을 준다', () => {
    expect(textSimilarity('', question.shortAnswer)).toBe(0)
    expect(textSimilarity('   ', question.shortAnswer)).toBe(0)
  })
})

describe('scoreSpokenAnswer', () => {
  it('말한 핵심 포인트만 covered로 표시한다', () => {
    const score = scoreSpokenAnswer(
      '뉴런의 선형 결합은 입력과 가중치의 내적으로 볼 수 있습니다',
      question,
    )

    expect(score.coverage[0]?.covered).toBe(true)
    expect(score.coverage[1]?.covered).toBe(false)
    expect(score.coveredCount).toBe(1)
    expect(score.keyPointCount).toBe(2)
  })

  it('조사가 달라도 같은 낱말이면 짚은 것으로 본다', () => {
    const score = scoreSpokenAnswer('코사인 similarity 는 크기보다 방향을 비교합니다', question)

    expect(score.coverage[1]?.covered).toBe(true)
  })

  it('아무 말도 하지 않으면 어떤 포인트도 covered가 아니다', () => {
    const score = scoreSpokenAnswer('', question)

    expect(score.similarity).toBe(0)
    expect(score.coveredCount).toBe(0)
    expect(score.coverage).toHaveLength(2)
  })
})

describe('similarityBand', () => {
  it('구간을 나눈다', () => {
    expect(similarityBand(10)).toBe('low')
    expect(similarityBand(40)).toBe('partial')
    expect(similarityBand(70)).toBe('high')
  })
})

describe('한국어 발음으로 말한 영문 용어', () => {
  it('한글 발음과 영문 표기를 같은 말로 본다', () => {
    expect(textSimilarity('어텐션', 'attention')).toBe(100)
    expect(textSimilarity('엘엘엠', 'LLM')).toBe(100)
    expect(textSimilarity('그래디언트', 'gradient')).toBe(100)
    expect(textSimilarity('토큰', 'token')).toBe(100)
  })

  it('긴 표기를 짧은 표기보다 먼저 바꾼다', () => {
    // '셀프어텐션'이 '어텐션'에 먼저 먹히면 selfattention이 되지 않는다.
    expect(textSimilarity('셀프어텐션', 'selfattention')).toBe(100)
  })

  it('영문 용어를 한글로 말해도 핵심 포인트를 짚은 것으로 본다', () => {
    const score = scoreSpokenAnswer('코사인 유사도는 크기보다 방향을 비교합니다', question)

    expect(score.coverage[1]?.covered).toBe(true)
  })
})

describe('scoreBestCandidate', () => {
  it('후보 중 가장 잘 맞는 것으로 채점한다', () => {
    const best = scoreBestCandidate(['전혀 다른 말', question.shortAnswer], question)

    expect(best?.similarity).toBe(100)
  })

  it('빈 후보만 있으면 채점하지 않는다', () => {
    expect(scoreBestCandidate(['', '   '], question)).toBeNull()
  })
})
