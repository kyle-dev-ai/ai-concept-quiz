import { useEffect, useRef, useState } from 'react'
import type { AdPlacement, BannerAdProvider } from '../../application/ports/banner-ad-provider'

interface AdSlotProps {
  readonly enabled: boolean
  readonly placement: AdPlacement
  readonly provider: BannerAdProvider
}

export function AdSlot({ enabled, placement, provider }: AdSlotProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'rendered' | 'unavailable'>('loading')

  useEffect(() => {
    if (!enabled || targetRef.current === null) {
      return
    }

    setState('loading')
    return provider.attach({
      placement,
      target: targetRef.current,
      onRendered: () => setState('rendered'),
      onUnavailable: () => setState('unavailable'),
    })
  }, [enabled, placement, provider])

  if (!enabled || state === 'unavailable') {
    return null
  }

  return (
    <aside
      className="ad-slot"
      data-ad-placement={placement}
      data-ad-format={placement === 'study-bottom-banner' ? 'adaptive-banner' : 'inline'}
      data-ad-state={state}
      aria-label="광고"
      aria-busy={state === 'loading'}
    >
      <div ref={targetRef} className="ad-slot__target" />
      {state === 'loading' ? <span className="ad-slot__loading">AD</span> : null}
    </aside>
  )
}
