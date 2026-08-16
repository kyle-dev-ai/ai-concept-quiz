import type { LearningGoalId } from './goal'
import type { Difficulty } from './question'

export const learnerGroupIds = [
  'teen-student',
  'university-student',
  'graduate-learner',
  'career-switcher',
  'professional',
  'general',
] as const

export type LearnerGroupId = (typeof learnerGroupIds)[number]

export interface LearnerGroup {
  readonly id: LearnerGroupId
  readonly label: string
  readonly description: string
  readonly recommendedDifficulties: readonly Difficulty[]
}

export interface LearnerProfile {
  readonly version: 1
  readonly nickname: string
  readonly groupId: LearnerGroupId
  readonly learningGoalId: LearningGoalId
  readonly goalNote: string
  readonly createdAt: string
}

export const learnerGroups: readonly LearnerGroup[] = [
  {
    id: 'teen-student',
    label: '10대 학생',
    description: '쉬운 말과 큰 그림부터',
    recommendedDifficulties: ['foundation'],
  },
  {
    id: 'university-student',
    label: '대학생',
    description: '기초와 전공 연결 중심',
    recommendedDifficulties: ['foundation', 'intermediate'],
  },
  {
    id: 'graduate-learner',
    label: '대학원 준비·재학',
    description: '원리와 꼬리질문까지',
    recommendedDifficulties: ['foundation', 'intermediate', 'advanced'],
  },
  {
    id: 'career-switcher',
    label: '이직 준비',
    description: '면접과 포트폴리오 연결',
    recommendedDifficulties: ['foundation', 'intermediate', 'advanced'],
  },
  {
    id: 'professional',
    label: '직장인',
    description: '실무 의사결정 중심',
    recommendedDifficulties: ['foundation', 'intermediate', 'advanced'],
  },
  {
    id: 'general',
    label: 'AI 입문자',
    description: '비개발자도 핵심만',
    recommendedDifficulties: ['foundation'],
  },
]

export const learnerGroupById = Object.fromEntries(
  learnerGroups.map((group) => [group.id, group]),
) as Record<LearnerGroupId, LearnerGroup>

export function isLearnerGroupId(value: unknown): value is LearnerGroupId {
  return typeof value === 'string' && learnerGroupIds.includes(value as LearnerGroupId)
}

const nicknameAdjectives = ['질문 많은', '맥락 찾는', '차근차근', '집요한', '연결하는', '꾸준한']
const nicknameNouns = ['수달', '문어', '참새', '여우', '두더지', '카피바라']

export function createNickname(random: () => number = Math.random): string {
  const adjective = nicknameAdjectives[Math.floor(random() * nicknameAdjectives.length)]
  const noun = nicknameNouns[Math.floor(random() * nicknameNouns.length)]
  return `${adjective ?? nicknameAdjectives[0]} ${noun ?? nicknameNouns[0]}`
}

export function createLearnerProfile(input: {
  readonly nickname: string
  readonly groupId: LearnerGroupId
  readonly learningGoalId: LearningGoalId
  readonly goalNote: string
  readonly createdAt?: Date
}): LearnerProfile {
  return {
    version: 1,
    nickname: input.nickname.trim().slice(0, 20),
    groupId: input.groupId,
    learningGoalId: input.learningGoalId,
    goalNote: input.goalNote.trim().slice(0, 60),
    createdAt: (input.createdAt ?? new Date()).toISOString(),
  }
}
