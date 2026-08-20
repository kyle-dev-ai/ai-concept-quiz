import type { SoundPreference } from '../../domain/preferences/sound'

export interface SoundPreferenceRepository {
  load(): Promise<SoundPreference>
  save(preference: SoundPreference): Promise<void>
}
