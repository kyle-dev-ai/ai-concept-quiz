import type { KeyValueStore } from '../../application/ports/key-value-store'
import type { ProgressRepository } from '../../application/ports/progress-repository'
import { isLearningGoalId } from '../../domain/learning/goal'
import {
  createInitialProgress,
  knowledgeRatings,
  type LearningProgress,
  type QuestionProgress,
} from '../../domain/learning/progress'

const storageKey = 'attention-ai-progress-v1'
const maxStoredProgressLength = 500_000
const maxStoredQuestionCount = 500
const questionIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (match === null) {
    return false
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

function isQuestionProgress(value: unknown): value is QuestionProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<QuestionProgress>
  return (
    typeof candidate.rating === 'string' &&
    knowledgeRatings.includes(candidate.rating as QuestionProgress['rating']) &&
    Number.isSafeInteger(candidate.reviewCount) &&
    (candidate.reviewCount ?? 0) >= 1 &&
    isIsoDate(candidate.lastReviewedAt)
  )
}

function parseProgress(raw: string | null): LearningProgress {
  if (raw === null || raw.length > maxStoredProgressLength) {
    return createInitialProgress()
  }

  try {
    const candidate = JSON.parse(raw) as Partial<LearningProgress>
    if (
      candidate.version !== 1 ||
      !isLearningGoalId(candidate.selectedGoal) ||
      typeof candidate.questions !== 'object' ||
      candidate.questions === null ||
      Array.isArray(candidate.questions)
    ) {
      return createInitialProgress()
    }

    const questions = Object.fromEntries(
      Object.entries(candidate.questions)
        .slice(0, maxStoredQuestionCount)
        .filter(
          (entry): entry is [string, QuestionProgress] =>
            questionIdPattern.test(entry[0]) && isQuestionProgress(entry[1]),
        ),
    )

    return {
      version: 1,
      selectedGoal: candidate.selectedGoal,
      questions,
      activityDates: Array.isArray(candidate.activityDates)
        ? candidate.activityDates.filter(isLocalDate).slice(-366)
        : [],
    }
  } catch {
    return createInitialProgress()
  }
}

export class LocalProgressRepository implements ProgressRepository {
  private readonly storage: KeyValueStore

  public constructor(storage: KeyValueStore) {
    this.storage = storage
  }

  public async load(): Promise<LearningProgress> {
    return parseProgress(await this.storage.getItem(storageKey))
  }

  public async save(progress: LearningProgress): Promise<void> {
    await this.storage.setItem(storageKey, JSON.stringify(progress))
  }
}
