import type { LearningGoalId } from './goal'

export const knowledgeRatings = ['known', 'unsure', 'unknown'] as const

export type KnowledgeRating = (typeof knowledgeRatings)[number]

export interface QuestionProgress {
  readonly rating: KnowledgeRating
  readonly reviewCount: number
  readonly lastReviewedAt: string
  /** 이 문항에서 지금까지 받은 가장 높은 발화 유사도(0~100). */
  readonly bestSimilarity?: number
  /** 가장 최근 발화 유사도(0~100). */
  readonly lastSimilarity?: number
  /** 가장 최근에 말하지 못한 핵심 포인트. 약점 덱을 꾸릴 때 쓴다. */
  readonly missedKeyPoints?: readonly string[]
}

/** 한 번의 발화 시도에서 나온 결과. 음성 인식을 못 쓰면 기록되지 않는다. */
export interface SpokenAttempt {
  readonly similarity: number
  readonly missedKeyPoints: readonly string[]
}

export interface LearningProgress {
  readonly version: 1
  readonly selectedGoal: LearningGoalId
  readonly questions: Readonly<Record<string, QuestionProgress>>
  readonly activityDates: readonly string[]
}

export interface ProgressSummary {
  readonly reviewed: number
  readonly known: number
  readonly unsure: number
  readonly unknown: number
}

export interface LearnerLevel {
  readonly id: string
  readonly label: string
  readonly minScore: number
  readonly nextScore: number | null
}

export const learnerLevels: readonly LearnerLevel[] = [
  { id: 'seed', label: '씨앗 질문가', minScore: 0, nextScore: 20 },
  { id: 'explorer', label: '개념 탐험가', minScore: 20, nextScore: 40 },
  { id: 'connector', label: '연결 설계자', minScore: 40, nextScore: 60 },
  { id: 'explainer', label: '설명 훈련가', minScore: 60, nextScore: 80 },
  { id: 'orator', label: 'AI 구술가', minScore: 80, nextScore: null },
]

export function createInitialProgress(): LearningProgress {
  return {
    version: 1,
    selectedGoal: 'graduate-school',
    questions: {},
    activityDates: [],
  }
}

export function withSelectedGoal(
  progress: LearningProgress,
  selectedGoal: LearningGoalId,
): LearningProgress {
  return { ...progress, selectedGoal }
}

export function recordReview(
  progress: LearningProgress,
  questionId: string,
  rating: KnowledgeRating,
  reviewedAt = new Date(),
  attempt?: SpokenAttempt,
): LearningProgress {
  const previous = progress.questions[questionId]
  const localDate = toLocalDate(reviewedAt)

  // 발화 기록은 음성 인식이 동작한 경우에만 갱신한다. 마이크를 못 쓴 날이
  // 최고 기록을 지우면 안 되므로 기존 값을 그대로 물려준다.
  const spoken =
    attempt === undefined
      ? {
          bestSimilarity: previous?.bestSimilarity,
          lastSimilarity: previous?.lastSimilarity,
          missedKeyPoints: previous?.missedKeyPoints,
        }
      : {
          bestSimilarity: Math.max(previous?.bestSimilarity ?? 0, attempt.similarity),
          lastSimilarity: attempt.similarity,
          missedKeyPoints: attempt.missedKeyPoints,
        }

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        rating,
        reviewCount: (previous?.reviewCount ?? 0) + 1,
        lastReviewedAt: reviewedAt.toISOString(),
        ...(spoken.bestSimilarity === undefined ? {} : { bestSimilarity: spoken.bestSimilarity }),
        ...(spoken.lastSimilarity === undefined ? {} : { lastSimilarity: spoken.lastSimilarity }),
        ...(spoken.missedKeyPoints === undefined
          ? {}
          : { missedKeyPoints: spoken.missedKeyPoints }),
      },
    },
    activityDates: Array.from(new Set([...progress.activityDates, localDate])).slice(-366),
  }
}

/** 이 문항에서 아직 말하지 못한 핵심 포인트가 남아 있는지. */
export function hasWeakness(entry: QuestionProgress | undefined): boolean {
  return (entry?.missedKeyPoints?.length ?? 0) > 0
}

export function toLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 오늘 한 문항이라도 봤는지. 연속 기록이 오늘까지 이어졌는지 판단할 때 쓴다. */
export function hasStudiedToday(progress: LearningProgress, today = new Date()): boolean {
  return progress.activityDates.includes(toLocalDate(today))
}

/**
 * 이어온 학습 일수.
 *
 * 오늘 아직 학습하지 않았다면 어제까지의 기록을 그대로 돌려준다. 오늘부터 세면
 * 아침에 앱을 열 때마다 연속 기록이 0으로 보이는데, 이는 사실과 다를 뿐 아니라
 * 기록을 이어갈 동기가 가장 필요한 순간에 정반대로 작동한다.
 * 오늘이 아직 비었다는 사실은 `hasStudiedToday`로 따로 알린다.
 */
export function calculateStreak(progress: LearningProgress, today = new Date()): number {
  const activeDates = new Set(progress.activityDates)
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  if (!activeDates.has(toLocalDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (activeDates.has(toLocalDate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

/** 하루에 이만큼 확인하면 오늘 몫은 다 한 것으로 본다. */
export const dailyReviewGoal = 5

/**
 * 그 날 확인한 문항 수.
 * 날짜별 집계를 따로 저장하지 않고 각 문항의 마지막 확인 시각에서 센다.
 */
export function countReviewedOn(progress: LearningProgress, date = new Date()): number {
  const target = toLocalDate(date)

  return Object.values(progress.questions).filter((entry) => {
    const reviewedAt = new Date(entry.lastReviewedAt)
    return !Number.isNaN(reviewedAt.getTime()) && toLocalDate(reviewedAt) === target
  }).length
}

export function calculateMasteryScore(progress: LearningProgress, questionCount: number): number {
  if (questionCount <= 0) {
    return 0
  }

  const earned = Object.values(progress.questions).reduce((score, question) => {
    if (question.rating === 'known') {
      return score + 1
    }
    if (question.rating === 'unsure') {
      return score + 0.5
    }
    return score
  }, 0)

  return Math.min(100, Math.round((earned / questionCount) * 100))
}

export function getLearnerLevel(score: number): LearnerLevel {
  const level = [...learnerLevels].reverse().find((candidate) => score >= candidate.minScore)
  const firstLevel = learnerLevels[0]

  if (level !== undefined) {
    return level
  }
  if (firstLevel === undefined) {
    throw new Error('학습 레벨 설정이 비어 있습니다.')
  }
  return firstLevel
}

export function getLearnerLevelNumber(score: number): number {
  const currentLevel = getLearnerLevel(score)
  return learnerLevels.findIndex((level) => level.id === currentLevel.id) + 1
}

export function summarizeProgress(progress: LearningProgress): ProgressSummary {
  const entries = Object.values(progress.questions)

  return entries.reduce<ProgressSummary>(
    (summary, entry) => ({
      reviewed: summary.reviewed + 1,
      known: summary.known + (entry.rating === 'known' ? 1 : 0),
      unsure: summary.unsure + (entry.rating === 'unsure' ? 1 : 0),
      unknown: summary.unknown + (entry.rating === 'unknown' ? 1 : 0),
    }),
    { reviewed: 0, known: 0, unsure: 0, unknown: 0 },
  )
}
