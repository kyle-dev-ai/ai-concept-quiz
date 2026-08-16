import type { ThemePreference } from '../../domain/preferences/theme'

export interface ThemeController {
  apply(preference: ThemePreference): void
  dispose(): void
}
