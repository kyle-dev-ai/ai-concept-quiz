import type { KeyValueStore } from '../../application/ports/key-value-store'
import type { ThemePreferenceRepository } from '../../application/ports/theme-preference-repository'
import { isThemePreference, type ThemePreference } from '../../domain/preferences/theme'

const storageKey = 'attention-ai-theme-v1'

export class LocalThemePreferenceRepository implements ThemePreferenceRepository {
  private readonly storage: KeyValueStore

  public constructor(storage: KeyValueStore) {
    this.storage = storage
  }

  public async load(): Promise<ThemePreference> {
    const preference = await this.storage.getItem(storageKey)
    return isThemePreference(preference) ? preference : 'light'
  }

  public async save(preference: ThemePreference): Promise<void> {
    await this.storage.setItem(storageKey, preference)
  }
}
