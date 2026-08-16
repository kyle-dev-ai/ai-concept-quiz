import type { QuestionRepository } from '../application/ports/question-repository'
import type { StudyQuestion } from '../domain/learning/question'
import { sampleQuestions } from './sample-questions'

export class StaticQuestionRepository implements QuestionRepository {
  public async list(): Promise<readonly StudyQuestion[]> {
    return sampleQuestions
  }
}
