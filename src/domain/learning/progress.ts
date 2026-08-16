import type { LearningGoalId } from './goal'

export const knowledgeRatings = ['known', 'unsure', 'unknown'] as const

export type KnowledgeRating = (typeof knowledgeRatings)[number]

export interface QuestionProgress {
  readonly rating: KnowledgeRating
  readonly reviewCount: number
  readonly lastReviewedAt: string
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
): LearningProgress {
  const previous = progress.questions[questionId]
  const localDate = toLocalDate(reviewedAt)

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        rating,
        reviewCount: (previous?.reviewCount ?? 0) + 1,
        lastReviewedAt: reviewedAt.toISOString(),
      },
    },
    activityDates: Array.from(new Set([...progress.activityDates, localDate])).slice(-366),
  }
}

export function toLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateStreak(progress: LearningProgress, today = new Date()): number {
  const activeDates = new Set(progress.activityDates)
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let streak = 0

  while (activeDates.has(toLocalDate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
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
  return [...learnerLevels].reverse().find((level) => score >= level.minScore) ?? learnerLevels[0]
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
