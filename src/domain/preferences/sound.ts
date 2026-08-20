export const soundPreferences = ['on', 'off'] as const

export type SoundPreference = (typeof soundPreferences)[number]

export function isSoundPreference(value: unknown): value is SoundPreference {
  return soundPreferences.some((preference) => preference === value)
}
