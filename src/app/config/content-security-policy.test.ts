import { describe, expect, it } from 'vitest'
import { createContentSecurityPolicy } from './content-security-policy'

describe('createContentSecurityPolicy', () => {
  it('외부 연결과 실행 sink를 기본 차단한다', () => {
    const policy = createContentSecurityPolicy(undefined)

    expect(policy).toContain("default-src 'self'")
    expect(policy).toContain("script-src 'self'")
    expect(policy).toContain("connect-src 'self'")
    expect(policy).toContain("object-src 'none'")
    expect(policy).not.toContain('unsafe-inline')
    expect(policy).not.toContain('unsafe-eval')
  })

  it('설정된 Sentry DSN의 HTTPS origin만 연결 대상으로 추가한다', () => {
    const policy = createContentSecurityPolicy(
      'https://public@example.ingest.sentry.io/123?ignored=value',
    )

    expect(policy).toContain("connect-src 'self' https://example.ingest.sentry.io")
    expect(policy).not.toContain('public@')
    expect(policy).not.toContain('/123')
  })

  it('HTTP 또는 잘못된 DSN은 release build 전에 거부한다', () => {
    expect(() => createContentSecurityPolicy('http://example.com/1')).toThrow('HTTPS Sentry DSN')
    expect(() => createContentSecurityPolicy('not-a-url')).toThrow('HTTPS Sentry DSN')
  })
})
