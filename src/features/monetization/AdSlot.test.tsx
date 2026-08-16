import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { adPlacements, type BannerAdProvider } from '../../application/ports/banner-ad-provider'
import { AdSlot } from './AdSlot'

const idleProvider: BannerAdProvider = { attach: () => () => undefined }

describe('AdSlot', () => {
  it('출시 전 광고 위치 이름 6개를 중복 없이 유지한다', () => {
    expect(adPlacements).toHaveLength(6)
    expect(new Set(adPlacements).size).toBe(6)
  })

  it('비활성 상태에서는 광고 DOM을 만들지 않는다', () => {
    const { container } = render(
      <AdSlot enabled={false} placement="study-bottom-banner" provider={idleProvider} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('provider가 렌더링하면 adaptive banner placement를 노출한다', async () => {
    const provider: BannerAdProvider = {
      attach: ({ onRendered }) => {
        onRendered()
        return () => undefined
      },
    }
    render(<AdSlot enabled={true} placement="study-bottom-banner" provider={provider} />)

    const slot = screen.getByLabelText('광고')
    expect(slot).toHaveAttribute('data-ad-placement', 'study-bottom-banner')
    expect(slot).toHaveAttribute('data-ad-format', 'adaptive-banner')
    await waitFor(() => expect(slot).toHaveAttribute('data-ad-state', 'rendered'))
  })

  it('No Fill이나 렌더 실패 시 구좌를 접고 provider를 정리한다', async () => {
    const destroy = vi.fn()
    const provider: BannerAdProvider = {
      attach: ({ onUnavailable }) => {
        onUnavailable('no fill')
        return destroy
      },
    }
    const { unmount } = render(
      <AdSlot enabled={true} placement="library-inline-banner" provider={provider} />,
    )

    await waitFor(() => expect(screen.queryByLabelText('광고')).not.toBeInTheDocument())
    unmount()
    expect(destroy).toHaveBeenCalledTimes(1)
  })
})
