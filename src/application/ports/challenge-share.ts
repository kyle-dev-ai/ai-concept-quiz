import type { StudyQuestion } from '../../domain/learning/question'

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'unavailable'

export interface ChallengeShare {
  share(question: StudyQuestion): Promise<ShareResult>
}
