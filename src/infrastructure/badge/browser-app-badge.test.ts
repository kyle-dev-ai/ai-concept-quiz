import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserAppBadge } from './browser-app-badge'

function installBadgeApi(setAppBadge: unknown, clearAppBadge: unknown): void {
  Object.defineProperty(navigator, 'setAppBadge', {
    configurable: true,
    writable: true,
    value: setAppBadge,
  })
  Object.defineProperty(navigator, 'clearAppBadge', {
    configurable: true,
    writable: true,
    value: clearAppBadge,
  })
}

afterEach(() => {
  Reflect.deleteProperty(navigator as unknown as Record<string, unknown>, 'setAppBadge')
  Reflect.deleteProperty(navigator as unknown as Record<string, unknown>, 'clearAppBadge')
})

describe('BrowserAppBadge', () => {
  it('밀린 복습 수를 배지로 올린다', () => {
    const setAppBadge = vi.fn(async () => undefined)
    installBadgeApi(
      setAppBadge,
      vi.fn(async () => undefined),
    )

    new BrowserAppBadge().set(7)

    expect(setAppBadge).toHaveBeenCalledWith(7)
  })

  it('0이면 배지를 지운다', () => {
    const setAppBadge = vi.fn(async () => undefined)
    const clearAppBadge = vi.fn(async () => undefined)
    installBadgeApi(setAppBadge, clearAppBadge)

    new BrowserAppBadge().set(0)

    expect(clearAppBadge).toHaveBeenCalled()
    expect(setAppBadge).not.toHaveBeenCalled()
  })

  it('지원하지 않는 환경에서는 아무 일도 하지 않는다', () => {
    expect(() => new BrowserAppBadge().set(3)).not.toThrow()
  })

  it('권한이 없어 거부되어도 학습 흐름을 막지 않는다', async () => {
    const rejection = Promise.reject(new Error('not installed'))
    installBadgeApi(
      vi.fn(() => rejection),
      vi.fn(async () => undefined),
    )

    expect(() => new BrowserAppBadge().set(3)).not.toThrow()
    // 어댑터가 catch하므로 unhandled rejection으로 번지지 않는다.
    await expect(rejection.catch(() => 'handled')).resolves.toBe('handled')
  })
})
