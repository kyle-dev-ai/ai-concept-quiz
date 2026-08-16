import type { StudyQuestion } from '../../domain/learning/question'

export interface QuestionRepository {
  list(): Promise<readonly StudyQuestion[]>
}
