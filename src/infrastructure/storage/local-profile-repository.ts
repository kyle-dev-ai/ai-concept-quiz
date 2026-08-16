import type { KeyValueStore } from '../../application/ports/key-value-store'
import type { ProfileRepository } from '../../application/ports/profile-repository'
import { isLearningGoalId } from '../../domain/learning/goal'
import { isLearnerGroupId, type LearnerProfile } from '../../domain/learning/learner-profile'

const storageKey = 'attention-ai-profile-v1'
const maxStoredProfileLength = 2_000

function isBoundedString(
  value: unknown,
  maximumLength: number,
  allowEmpty = false,
): value is string {
  return (
    typeof value === 'string' &&
    value.length <= maximumLength &&
    (allowEmpty || value.trim().length > 0)
  )
}

function parseProfile(raw: string | null): LearnerProfile | null {
  if (raw === null || raw.length > maxStoredProfileLength) {
    return null
  }

  try {
    const candidate = JSON.parse(raw) as Partial<LearnerProfile>
    if (
      candidate.version !== 1 ||
      !isBoundedString(candidate.nickname, 20) ||
      !isLearnerGroupId(candidate.groupId) ||
      !isLearningGoalId(candidate.learningGoalId) ||
      !isBoundedString(candidate.goalNote, 60, true) ||
      typeof candidate.createdAt !== 'string' ||
      !Number.isFinite(Date.parse(candidate.createdAt))
    ) {
      return null
    }

    return candidate as LearnerProfile
  } catch {
    return null
  }
}

export class LocalProfileRepository implements ProfileRepository {
  private readonly storage: KeyValueStore

  public constructor(storage: KeyValueStore) {
    this.storage = storage
  }

  public async load(): Promise<LearnerProfile | null> {
    return parseProfile(await this.storage.getItem(storageKey))
  }

  public async save(profile: LearnerProfile): Promise<void> {
    await this.storage.setItem(storageKey, JSON.stringify(profile))
  }
}
