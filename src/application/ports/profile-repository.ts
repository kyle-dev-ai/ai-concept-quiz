import type { LearnerProfile } from '../../domain/learning/learner-profile'

export interface ProfileRepository {
  load(): Promise<LearnerProfile | null>
  save(profile: LearnerProfile): Promise<void>
}
