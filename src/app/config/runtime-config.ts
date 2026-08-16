export const appProfiles = ['local', 'standalone', 'prd'] as const

export type AppProfile = (typeof appProfiles)[number]
export type ContentSource = 'static'

export interface RuntimeConfig {
  readonly profile: AppProfile
  readonly contentSource: ContentSource
  readonly adsEnabled: boolean
  readonly sentryDsn: string | null
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

function parseOptionalHttpsUrl(value: Environment[string], name: string): string | null {
  if (value === undefined || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    throw new Error(`${name}은 HTTPS URL이어야 합니다.`)
  }

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') {
      throw new Error('not https')
    }
    return value
  } catch {
    throw new Error(`${name}은 HTTPS URL이어야 합니다.`)
  }
}

export function createRuntimeConfig(environment: Environment): RuntimeConfig {
  const profile = parseProfile(environment.VITE_APP_PROFILE)

  return Object.freeze({
    profile,
    contentSource: parseContentSource(environment.VITE_CONTENT_SOURCE),
    adsEnabled: parseBoolean(environment.VITE_ADS_ENABLED),
    sentryDsn: parseOptionalHttpsUrl(environment.VITE_SENTRY_DSN, 'VITE_SENTRY_DSN'),
    isStandalone: profile === 'standalone',
    isAppsInToss: profile === 'prd',
  })
}

export const runtimeConfig = createRuntimeConfig(import.meta.env)
