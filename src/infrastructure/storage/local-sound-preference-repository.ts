import type { KeyValueStore } from '../../application/ports/key-value-store'
import type { SoundPreferenceRepository } from '../../application/ports/sound-preference-repository'
import { isSoundPreference, type SoundPreference } from '../../domain/preferences/sound'

const storageKey = 'attention-ai-sound-v1'

export class LocalSoundPreferenceRepository implements SoundPreferenceRepository {
  private readonly storage: KeyValueStore

  public constructor(storage: KeyValueStore) {
    this.storage = storage
  }

  public async load(): Promise<SoundPreference> {
    const preference = await this.storage.getItem(storageKey)
    return isSoundPreference(preference) ? preference : 'on'
  }

  public async save(preference: SoundPreference): Promise<void> {
    await this.storage.setItem(storageKey, preference)
  }
}
