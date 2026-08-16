import type { ThemePreference } from '../../domain/preferences/theme'

export interface ThemePreferenceRepository {
  load(): Promise<ThemePreference>
  save(preference: ThemePreference): Promise<void>
}
