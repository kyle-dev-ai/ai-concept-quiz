import type { AppBadge } from '../../application/ports/app-badge'

// Badging API는 표준 lib.dom 타입에 아직 없어서 쓰는 만큼만 선언한다.
interface BadgeCapableNavigator {
  setAppBadge?: (count?: number) => Promise<void>
  clearAppBadge?: () => Promise<void>
}

function badgeNavigator(): BadgeCapableNavigator | undefined {
  if (typeof navigator === 'undefined') {
    return undefined
  }
  return navigator as unknown as BadgeCapableNavigator
}

/**
 * 브라우저 Badging API 어댑터.
 *
 * 홈화면에 설치된 PWA에서만 동작하고 브라우저 탭에서는 조용히 무시된다.
 * 배지는 부가 신호일 뿐이라 실패해도 학습 흐름에 영향을 주지 않는다.
 */
export class BrowserAppBadge implements AppBadge {
  set(count: number): void {
    const target = badgeNavigator()
    if (target === undefined) {
      return
    }

    // 권한이 없거나 설치되지 않은 환경에서는 rejected promise가 온다. 조용히 넘긴다.
    if (count <= 0) {
      void target.clearAppBadge?.().catch(() => undefined)
      return
    }

    void target.setAppBadge?.(count).catch(() => undefined)
  }
}
