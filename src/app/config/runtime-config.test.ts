import { describe, expect, it } from 'vitest'
import { createRuntimeConfig } from './runtime-config'

describe('createRuntimeConfig', () => {
  it('standalone 프로파일을 PWA 실행 환경으로 표시한다', () => {
    expect(
      createRuntimeConfig({
        VITE_APP_PROFILE: 'standalone',
        VITE_CONTENT_SOURCE: 'static',
        VITE_ADS_ENABLED: 'false',
      }),
    ).toEqual({
      profile: 'standalone',
      contentSource: 'static',
      adsEnabled: false,
      isStandalone: true,
      isAppsInToss: false,
    })
  })

  it('알 수 없는 프로파일을 조용히 fallback하지 않는다', () => {
    expect(() =>
      createRuntimeConfig({
        VITE_APP_PROFILE: 'staging',
        VITE_CONTENT_SOURCE: 'static',
        VITE_ADS_ENABLED: 'false',
      }),
    ).toThrow('지원하지 않는 VITE_APP_PROFILE')
  })
})
