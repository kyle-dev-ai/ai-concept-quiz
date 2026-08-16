export function createContentSecurityPolicy(sentryDsn: string | undefined): string {
  const connectSources = new Set(["'self'"])

  if (sentryDsn !== undefined && sentryDsn.length > 0) {
    try {
      const sentryUrl = new URL(sentryDsn)
      if (sentryUrl.protocol !== 'https:') {
        throw new Error('not https')
      }
      connectSources.add(sentryUrl.origin)
    } catch {
      throw new Error('Content Security Policy에는 HTTPS Sentry DSN만 허용됩니다.')
    }
  }

  return [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${[...connectSources].join(' ')}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "frame-src 'none'",
    "form-action 'self'",
  ].join('; ')
}
