import { describe, expect, it } from 'vitest'
import { createLearnerProfile, createNickname } from './learner-profile'

describe('learner profile', () => {
  it('개인정보 없이 재현 가능한 별명을 만든다', () => {
    expect(createNickname(() => 0)).toBe('질문 많은 수달')
  })

  it('free text 길이를 기기 저장 한도에 맞게 제한한다', () => {
    const profile = createLearnerProfile({
      nickname: ' 질문 많은 수달 ',
      groupId: 'general',
      learningGoalId: 'ai-basics',
      goalNote: '가'.repeat(100),
      createdAt: new Date('2026-08-16T00:00:00.000Z'),
    })

    expect(profile.nickname).toBe('질문 많은 수달')
    expect(profile.goalNote).toHaveLength(60)
  })
})
