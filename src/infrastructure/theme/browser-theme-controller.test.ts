import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserThemeController } from './browser-theme-controller'

interface MatchMediaHarness {
  readonly mediaQuery: MediaQueryList
  readonly emit: (matches: boolean) => void
  readonly removeEventListener: ReturnType<typeof vi.fn>
}

function createMatchMediaHarness(initialMatches: boolean): MatchMediaHarness {
  let listener: ((event: MediaQueryListEvent) => void) | null = null
  const addEventListener = vi.fn(
    (_type: string, nextListener: (event: MediaQueryListEvent) => void) => {
      listener = nextListener
    },
  )
  const removeEventListener = vi.fn(
    (_type: string, currentListener: (event: MediaQueryListEvent) => void) => {
      if (listener === currentListener) {
        listener = null
      }
    },
  )
  const mediaQuery = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  return {
    mediaQuery,
    emit(matches) {
      listener?.({ matches } as MediaQueryListEvent)
    },
    removeEventListener,
  }
}

describe('BrowserThemeController', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    })
    document.documentElement.removeAttribute('data-theme')
  })

  it('명시한 다크 모드와 브라우저 chrome 색을 함께 적용한다', () => {
    const controller = new BrowserThemeController()

    controller.apply('dark')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#080d18')
  })

  it('기기 설정 변경을 따라가고 dispose 시 listener를 해제한다', () => {
    const harness = createMatchMediaHarness(false)
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => harness.mediaQuery),
    })
    const controller = new BrowserThemeController()

    controller.apply('system')
    expect(document.documentElement.dataset.theme).toBe('light')

    harness.emit(true)
    expect(document.documentElement.dataset.theme).toBe('dark')

    controller.dispose()
    expect(harness.removeEventListener).toHaveBeenCalledTimes(1)
  })
})
