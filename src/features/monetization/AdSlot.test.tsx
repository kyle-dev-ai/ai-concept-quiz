import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdSlot } from './AdSlot'

describe('AdSlot', () => {
  it('비활성 상태에서는 광고 DOM을 만들지 않는다', () => {
    const { container } = render(<AdSlot enabled={false} placement="study-bottom-banner" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('활성화하면 provider가 사용할 adaptive banner placement를 노출한다', () => {
    render(<AdSlot enabled={true} placement="study-bottom-banner" />)

    const slot = screen.getByLabelText('광고')
    expect(slot).toHaveAttribute('data-ad-placement', 'study-bottom-banner')
    expect(slot).toHaveAttribute('data-ad-format', 'adaptive-banner')
  })
})
