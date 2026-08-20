import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createInitialProgress, recordReview } from '../../domain/learning/progress'
import { ActivityCalendar } from './ActivityCalendar'

describe('ActivityCalendar', () => {
  it('학습한 날만 채워서 보여준다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date())
    progress = recordReview(progress, 'two', 'known', new Date(Date.now() - 86_400_000))

    const { container } = render(<ActivityCalendar progress={progress} days={14} />)

    expect(screen.getByText('2일 학습')).toBeInTheDocument()
    expect(container.querySelectorAll('.activity-grid i')).toHaveLength(14)
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(2)
  })

  it('오늘 칸을 따로 표시한다', () => {
    const { container } = render(<ActivityCalendar progress={createInitialProgress()} days={7} />)

    expect(container.querySelectorAll('[data-today="true"]')).toHaveLength(1)
    expect(screen.getByText('0일 학습')).toBeInTheDocument()
  })

  it('기록이 없어도 달력은 그려진다', () => {
    const { container } = render(<ActivityCalendar progress={createInitialProgress()} days={21} />)

    expect(container.querySelectorAll('.activity-grid i')).toHaveLength(21)
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(0)
  })
})
