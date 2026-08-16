import { describe, expect, it } from 'vitest'
import type { KeyValueStore } from '../../application/ports/key-value-store'
import { createLearnerProfile } from '../../domain/learning/learner-profile'
import { createInitialProgress, recordReview } from '../../domain/learning/progress'
import { LocalProfileRepository } from './local-profile-repository'
import { LocalProgressRepository } from './local-progress-repository'
import { LocalThemePreferenceRepository } from './local-theme-preference-repository'

class MemoryKeyValueStore implements KeyValueStore {
  private readonly values = new Map<string, string>()

  public async getItem(key: string): Promise<string | null> {
    return this.values.get(key) ?? null
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.values.set(key, value)
  }
}

describe('device repositories', () => {
  it('profile을 adapter 뒤에 저장하고 불러온다', async () => {
    const repository = new LocalProfileRepository(new MemoryKeyValueStore())
    const profile = createLearnerProfile({
      nickname: '맥락 찾는 여우',
      groupId: 'professional',
      learningGoalId: 'ai-practice',
      goalNote: 'RAG 평가를 설명한다',
      createdAt: new Date('2026-08-16T00:00:00.000Z'),
    })

    await repository.save(profile)

    await expect(repository.load()).resolves.toEqual(profile)
  })

  it('길이와 날짜 경계를 벗어난 profile payload를 신뢰하지 않는다', async () => {
    const storage = new MemoryKeyValueStore()
    await storage.setItem(
      'attention-ai-profile-v1',
      JSON.stringify({
        version: 1,
        nickname: '가'.repeat(21),
        groupId: 'professional',
        learningGoalId: 'ai-practice',
        goalNote: '',
        createdAt: 'not-a-date',
      }),
    )

    await expect(new LocalProfileRepository(storage).load()).resolves.toBeNull()
  })

  it('깨진 progress payload는 초기 상태로 복구한다', async () => {
    const storage = new MemoryKeyValueStore()
    await storage.setItem('attention-ai-progress-v1', '{not-json')
    const repository = new LocalProgressRepository(storage)

    await expect(repository.load()).resolves.toEqual(createInitialProgress())
  })

  it('reviewed progress를 저장한다', async () => {
    const repository = new LocalProgressRepository(new MemoryKeyValueStore())
    const progress = recordReview(
      createInitialProgress(),
      'question',
      'known',
      new Date('2026-08-16T00:00:00.000Z'),
    )

    await repository.save(progress)

    await expect(repository.load()).resolves.toEqual(progress)
  })

  it('변조된 progress 항목과 잘못된 날짜는 걸러낸다', async () => {
    const storage = new MemoryKeyValueStore()
    await storage.setItem(
      'attention-ai-progress-v1',
      JSON.stringify({
        version: 1,
        selectedGoal: 'graduate-school',
        questions: {
          'valid-question': {
            rating: 'known',
            reviewCount: 1,
            lastReviewedAt: '2026-08-16T00:00:00.000Z',
          },
          '../invalid': {
            rating: 'known',
            reviewCount: 1.5,
            lastReviewedAt: 'not-a-date',
          },
        },
        activityDates: ['2026-08-16', '2026-02-30', 'not-a-date'],
      }),
    )

    await expect(new LocalProgressRepository(storage).load()).resolves.toMatchObject({
      questions: { 'valid-question': expect.any(Object) },
      activityDates: ['2026-08-16'],
    })
  })

  it('화면 모드를 저장하고 알 수 없는 값은 라이트로 복구한다', async () => {
    const storage = new MemoryKeyValueStore()
    const repository = new LocalThemePreferenceRepository(storage)

    await expect(repository.load()).resolves.toBe('light')
    await repository.save('dark')
    await expect(repository.load()).resolves.toBe('dark')

    await storage.setItem('attention-ai-theme-v1', 'sepia')
    await expect(repository.load()).resolves.toBe('light')
  })
})
