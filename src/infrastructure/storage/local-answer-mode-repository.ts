import type { AnswerModeRepository } from '../../application/ports/answer-mode-repository'
import type { KeyValueStore } from '../../application/ports/key-value-store'
import { type AnswerMode, isAnswerMode } from '../../domain/preferences/answer-mode'

const storageKey = 'attention-ai-answer-mode-v1'

export class LocalAnswerModeRepository implements AnswerModeRepository {
  private readonly storage: KeyValueStore

  public constructor(storage: KeyValueStore) {
    this.storage = storage
  }

  public async load(): Promise<AnswerMode> {
    const mode = await this.storage.getItem(storageKey)
    return isAnswerMode(mode) ? mode : 'spoken'
  }

  public async save(mode: AnswerMode): Promise<void> {
    await this.storage.setItem(storageKey, mode)
  }
}
