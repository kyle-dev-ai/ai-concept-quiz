import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressRing } from './ProgressRing'

function ringValue(container: HTMLElement): SVGCircleElement | null {
  return container.querySelector('.progress-ring__value')
}

describe('ProgressRing', () => {
  it('진행한 만큼만 링을 채운다', () => {
    const { container } = render(<ProgressRing value={2} goal={5} label="오늘의 목표" />)

    expect(screen.getByLabelText('오늘의 목표 5개 중 2개')).toBeInTheDocument()

    const circle = ringValue(container)
    const circumference = Number(circle?.getAttribute('stroke-dasharray'))
    const offset = Number(circle?.getAttribute('stroke-dashoffset'))
    // 2/5를 채웠으므로 남은 3/5만큼 비워진다.
    expect(offset / circumference).toBeCloseTo(0.6, 5)
  })

  it('목표를 채우면 완료로 표시한다', () => {
    const { container } = render(<ProgressRing value={5} goal={5} label="오늘의 목표" />)

    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(container.querySelector('.progress-ring')).toHaveAttribute('data-complete', 'true')
  })

  it('목표를 넘겨도 링이 넘치지 않는다', () => {
    const { container } = render(<ProgressRing value={9} goal={5} label="오늘의 목표" />)

    expect(Number(ringValue(container)?.getAttribute('stroke-dashoffset'))).toBe(0)
    expect(screen.getByLabelText('오늘의 목표 5개 중 9개')).toBeInTheDocument()
  })

  it('아직 아무것도 안 했으면 비어 있다', () => {
    const { container } = render(<ProgressRing value={0} goal={5} label="오늘의 목표" />)

    const circle = ringValue(container)
    expect(Number(circle?.getAttribute('stroke-dashoffset'))).toBeCloseTo(
      Number(circle?.getAttribute('stroke-dasharray')),
      5,
    )
  })
})
