export const appProfiles = ['local', 'standalone', 'prd'] as const

export type AppProfile = (typeof appProfiles)[number]
export type ContentSource = 'static'

export interface RuntimeConfig {
  readonly profile: AppProfile
  readonly contentSource: ContentSource
  readonly adsEnabled: boolean
  readonly isStandalone: boolean
  readonly isAppsInToss: boolean
}

type Environment = Record<string, boolean | string | undefined>

function parseProfile(value: Environment[string]): AppProfile {
  if (typeof value === 'string' && appProfiles.includes(value as AppProfile)) {
    return value as AppProfile
  }

  throw new Error(`지원하지 않는 VITE_APP_PROFILE입니다: ${String(value)}`)
}

function parseContentSource(value: Environment[string]): ContentSource {
  if (value === 'static') {
    return value
  }

  throw new Error(`지원하지 않는 VITE_CONTENT_SOURCE입니다: ${String(value)}`)
}

function parseBoolean(value: Environment[string]): boolean {
  return value === true || value === 'true'
}

export function createRuntimeConfig(environment: Environment): RuntimeConfig {
  const profile = parseProfile(environment.VITE_APP_PROFILE)

  return Object.freeze({
    profile,
    contentSource: parseContentSource(environment.VITE_CONTENT_SOURCE),
    adsEnabled: parseBoolean(environment.VITE_ADS_ENABLED),
    isStandalone: profile === 'standalone',
    isAppsInToss: profile === 'prd',
  })
}

export const runtimeConfig = createRuntimeConfig(import.meta.env)
