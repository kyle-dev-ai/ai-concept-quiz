import { describe, expect, it } from 'vitest'
import { isThemePreference } from './theme'

describe('theme preference', () => {
  it.each(['system', 'light', 'dark'])('%s은 지원하는 화면 모드다', (preference) => {
    expect(isThemePreference(preference)).toBe(true)
  })

  it('알 수 없는 저장값은 거부한다', () => {
    expect(isThemePreference('oled')).toBe(false)
    expect(isThemePreference(null)).toBe(false)
  })
})
