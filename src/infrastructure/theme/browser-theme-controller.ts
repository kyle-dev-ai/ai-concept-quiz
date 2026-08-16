import type { ThemeController } from '../../application/ports/theme-controller'
import type { ThemePreference } from '../../domain/preferences/theme'

const darkModeQuery = '(prefers-color-scheme: dark)'
const themeColors = Object.freeze({
  light: '#f4f7fc',
  dark: '#080d18',
})

type EffectiveTheme = keyof typeof themeColors

export class BrowserThemeController implements ThemeController {
  private mediaQuery: MediaQueryList | null = null
  private readonly handleSystemThemeChange = (event: MediaQueryListEvent) => {
    this.applyEffectiveTheme(event.matches ? 'dark' : 'light')
  }

  public apply(preference: ThemePreference): void {
    this.stopWatchingSystemTheme()

    if (preference === 'system') {
      if (typeof window.matchMedia !== 'function') {
        this.applyEffectiveTheme('light')
        return
      }

      this.mediaQuery = window.matchMedia(darkModeQuery)
      this.applyEffectiveTheme(this.mediaQuery.matches ? 'dark' : 'light')
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange)
      return
    }

    this.applyEffectiveTheme(preference)
  }

  public dispose(): void {
    this.stopWatchingSystemTheme()
  }

  private applyEffectiveTheme(theme: EffectiveTheme): void {
    document.documentElement.dataset.theme = theme
    const themeColorMeta =
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]') ??
      document.head.appendChild(document.createElement('meta'))
    themeColorMeta.name = 'theme-color'
    themeColorMeta.content = themeColors[theme]
  }

  private stopWatchingSystemTheme(): void {
    this.mediaQuery?.removeEventListener('change', this.handleSystemThemeChange)
    this.mediaQuery = null
  }
}
