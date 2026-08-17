import { describe, expect, it } from 'vitest'
import type { LearningProgress } from './progress'
import type { StudyQuestion } from './question'
import { orderByReview, overdueDays, planReview, reviewIntervalDays } from './review'

function question(id: string): StudyQuestion {
  return {
    id,
    category: 'ml',
    difficulty: 'foundation',
    term: id,
    prompt: `${id} 질문입니다.`,
    shortAnswer: '짧은 답변입니다. 두 문장으로 씁니다.',
    deepAnswer: '심화 답변입니다. 조건과 한계를 덧붙입니다.',
    keyPoints: ['핵심 하나', '핵심 둘'],
    followUp: '꼬리질문입니다.',
    prerequisites: [],
  }
}

function progressWith(
  entries: Record<string, { rating: 'known' | 'unsure' | 'unknown'; days: number; count: number }>,
  now: Date,
): LearningProgress {
  const questions: LearningProgress['questions'] = {}
  for (const [id, entry] of Object.entries(entries)) {
    const reviewedAt = new Date(now)
    reviewedAt.setDate(reviewedAt.getDate() - entry.days)
    Object.assign(questions, {
      [id]: {
        rating: entry.rating,
        reviewCount: entry.count,
        lastReviewedAt: reviewedAt.toISOString(),
      },
    })
  }

  return { version: 1, selectedGoal: 'ai-basics', questions, activityDates: [] }
}

const now = new Date('2026-08-17T09:00:00+09:00')

describe('review scheduling', () => {
  it('모를수록 짧은 간격으로, 반복할수록 긴 간격으로 다시 본다', () => {
    expect(reviewIntervalDays('unknown', 1)).toBe(1)
    expect(reviewIntervalDays('unsure', 1)).toBe(3)
    expect(reviewIntervalDays('known', 1)).toBe(7)
    expect(reviewIntervalDays('known', 2)).toBeGreaterThan(reviewIntervalDays('known', 1))
    expect(reviewIntervalDays('known', 5)).toBeGreaterThan(reviewIntervalDays('known', 2))
  })

  it('간격이 지난 만큼을 밀린 일수로 계산한다', () => {
    const progress = progressWith({ a: { rating: 'known', days: 10, count: 1 } }, now)
    const entry = progress.questions.a as NonNullable<(typeof progress.questions)['a']>

    expect(overdueDays(entry, now)).toBe(3)
  })

  it('본 적 없는 문항과 복습할 문항과 쉬는 문항을 나눈다', () => {
    const progress = progressWith(
      {
        overdue: { rating: 'known', days: 30, count: 1 },
        resting: { rating: 'known', days: 1, count: 1 },
      },
      now,
    )

    const plan = planReview(
      [question('overdue'), question('resting'), question('new')],
      progress,
      now,
    )

    expect(plan.due.map((item) => item.id)).toEqual(['overdue'])
    expect(plan.fresh.map((item) => item.id)).toEqual(['new'])
    expect(plan.resting.map((item) => item.id)).toEqual(['resting'])
  })

  it('많이 밀린 문항을 먼저 배치하고 새 문항이 그다음에 온다', () => {
    const progress = progressWith(
      {
        slightly: { rating: 'known', days: 8, count: 1 },
        badly: { rating: 'unknown', days: 20, count: 1 },
      },
      now,
    )

    const ordered = orderByReview(
      [question('new'), question('slightly'), question('badly')],
      progress,
      10,
      now,
    )

    expect(ordered.map((item) => item.id)).toEqual(['badly', 'slightly', 'new'])
  })

  it('복습이 아무리 많아도 세션의 일부는 새 문항에 남겨둔다', () => {
    const entries: Record<string, { rating: 'known'; days: number; count: number }> = {}
    for (let index = 0; index < 20; index += 1) {
      entries[`old-${index}`] = { rating: 'known', days: 90, count: 1 }
    }

    const ordered = orderByReview(
      [...Object.keys(entries).map(question), question('new')],
      progressWith(entries, now),
      10,
      now,
    )

    expect(ordered.slice(0, 6).every((item) => item.id.startsWith('old-'))).toBe(true)
    expect(ordered[6]?.id).toBe('new')
  })
})
