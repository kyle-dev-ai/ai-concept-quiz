import type { AnswerMode } from '../../domain/preferences/answer-mode'

export interface AnswerModeRepository {
  load(): Promise<AnswerMode>
  save(mode: AnswerMode): Promise<void>
}
