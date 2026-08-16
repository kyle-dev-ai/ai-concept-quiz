import type { LearningProgress } from '../../domain/learning/progress'

export interface ProgressRepository {
  load(): Promise<LearningProgress>
  save(progress: LearningProgress): Promise<void>
}
