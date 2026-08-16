export type AdPlacement = 'learn-home-inline' | 'study-bottom-banner' | 'session-complete'

interface AdSlotProps {
  readonly enabled: boolean
  readonly placement: AdPlacement
}

export function AdSlot({ enabled, placement }: AdSlotProps) {
  if (!enabled) {
    return null
  }

  return (
    <aside
      className="ad-slot"
      data-ad-placement={placement}
      data-ad-format={placement === 'study-bottom-banner' ? 'adaptive-banner' : 'inline'}
      aria-label="광고"
    >
      <span>Sponsored</span>
      <p>광고 provider가 연결되면 이 위치에 표시돼요.</p>
    </aside>
  )
}
