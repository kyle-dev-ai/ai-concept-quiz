import { describe, expect, it } from 'vitest'
import {
  calculateMasteryScore,
  calculateStreak,
  countReviewedOn,
  createInitialProgress,
  getLearnerLevel,
  getLearnerLevelNumber,
  hasStudiedToday,
  hasWeakness,
  recordReview,
} from './progress'

describe('learning progress', () => {
  it('최근 자기평가를 100점 설명력 점수로 계산한다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'known', 'known', new Date(2026, 7, 15, 10))
    progress = recordReview(progress, 'unsure', 'unsure', new Date(2026, 7, 16, 10))
    progress = recordReview(progress, 'unknown', 'unknown', new Date(2026, 7, 16, 11))

    expect(calculateMasteryScore(progress, 3)).toBe(50)
    expect(getLearnerLevel(50).label).toBe('연결 설계자')
  })

  it('연속된 local activity date를 streak로 계산한다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date(2026, 7, 15, 10))
    progress = recordReview(progress, 'two', 'known', new Date(2026, 7, 16, 10))

    expect(calculateStreak(progress, new Date(2026, 7, 16, 20))).toBe(2)
  })

  it('오늘 아직 학습하지 않아도 어제까지 이어온 기록을 유지한다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date(2026, 7, 19, 10))
    progress = recordReview(progress, 'two', 'known', new Date(2026, 7, 20, 10))

    // 8/21 아침, 아직 한 문항도 보지 않은 상태.
    expect(calculateStreak(progress, new Date(2026, 7, 21, 8))).toBe(2)
    expect(hasStudiedToday(progress, new Date(2026, 7, 21, 8))).toBe(false)
    expect(hasStudiedToday(progress, new Date(2026, 7, 20, 8))).toBe(true)
  })

  it('하루를 통째로 건너뛰면 연속 기록이 끊긴다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date(2026, 7, 18, 10))
    progress = recordReview(progress, 'two', 'known', new Date(2026, 7, 19, 10))

    // 8/20을 건너뛴 채 8/21에 열었다.
    expect(calculateStreak(progress, new Date(2026, 7, 21, 8))).toBe(0)
  })

  it('오늘 학습을 마치면 오늘까지 포함해 센다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date(2026, 7, 20, 10))
    progress = recordReview(progress, 'two', 'known', new Date(2026, 7, 21, 10))

    expect(calculateStreak(progress, new Date(2026, 7, 21, 20))).toBe(2)
    expect(hasStudiedToday(progress, new Date(2026, 7, 21, 20))).toBe(true)
  })

  it('발화 유사도의 최고 기록을 유지하고 최근 값을 갱신한다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'attention', 'unsure', new Date(2026, 7, 20, 10), {
      similarity: 61,
      missedKeyPoints: ['softmax로 가중치를 정규화'],
    })
    expect(progress.questions.attention).toMatchObject({
      bestSimilarity: 61,
      lastSimilarity: 61,
    })

    // 다음 시도가 더 낮아도 최고 기록은 남는다.
    progress = recordReview(progress, 'attention', 'known', new Date(2026, 7, 21, 10), {
      similarity: 45,
      missedKeyPoints: [],
    })
    expect(progress.questions.attention).toMatchObject({
      bestSimilarity: 61,
      lastSimilarity: 45,
      missedKeyPoints: [],
    })
  })

  it('음성 기록 없이 평가하면 기존 최고 기록을 지우지 않는다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'attention', 'unsure', new Date(2026, 7, 20, 10), {
      similarity: 61,
      missedKeyPoints: ['softmax로 가중치를 정규화'],
    })
    progress = recordReview(progress, 'attention', 'known', new Date(2026, 7, 21, 10))

    expect(progress.questions.attention).toMatchObject({
      bestSimilarity: 61,
      lastSimilarity: 61,
      missedKeyPoints: ['softmax로 가중치를 정규화'],
    })
  })

  it('못 말한 핵심 포인트가 남아 있는 문항만 약점으로 본다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'weak-one', 'unsure', new Date(2026, 7, 21, 10), {
      similarity: 20,
      missedKeyPoints: ['정규화'],
    })
    progress = recordReview(progress, 'solid-one', 'known', new Date(2026, 7, 21, 10), {
      similarity: 80,
      missedKeyPoints: [],
    })

    expect(hasWeakness(progress.questions['weak-one'])).toBe(true)
    expect(hasWeakness(progress.questions['solid-one'])).toBe(false)
    expect(hasWeakness(progress.questions.never)).toBe(false)
  })

  it('오늘 확인한 문항만 오늘 몫으로 센다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'yesterday-one', 'known', new Date(2026, 7, 20, 22))
    progress = recordReview(progress, 'today-one', 'known', new Date(2026, 7, 21, 9))
    progress = recordReview(progress, 'today-two', 'unsure', new Date(2026, 7, 21, 21))

    expect(countReviewedOn(progress, new Date(2026, 7, 21, 23))).toBe(2)
    expect(countReviewedOn(progress, new Date(2026, 7, 20, 23))).toBe(1)
    expect(countReviewedOn(progress, new Date(2026, 7, 19, 23))).toBe(0)
  })

  it('같은 문항을 두 번 봐도 오늘 몫은 하나로 센다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'same', 'unsure', new Date(2026, 7, 21, 9))
    progress = recordReview(progress, 'same', 'known', new Date(2026, 7, 21, 20))

    expect(countReviewedOn(progress, new Date(2026, 7, 21, 23))).toBe(1)
  })

  it('0점부터 100점까지 다섯 레벨의 경계를 계산한다', () => {
    expect(getLearnerLevelNumber(0)).toBe(1)
    expect(getLearnerLevelNumber(19)).toBe(1)
    expect(getLearnerLevelNumber(20)).toBe(2)
    expect(getLearnerLevelNumber(80)).toBe(5)
    expect(getLearnerLevelNumber(100)).toBe(5)
  })

  it('같은 질문을 다시 보면 review count를 올린다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'same', 'unknown', new Date(2026, 7, 16, 9))
    progress = recordReview(progress, 'same', 'known', new Date(2026, 7, 16, 10))

    expect(progress.questions.same).toMatchObject({ rating: 'known', reviewCount: 2 })
    expect(progress.activityDates).toEqual(['2026-08-16'])
  })
})
