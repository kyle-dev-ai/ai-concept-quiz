import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createInitialProgress, recordReview } from '../../domain/learning/progress'
import { ActivityCalendar } from './ActivityCalendar'

describe('ActivityCalendar', () => {
  it('요일 머리글을 월요일부터 세운다', () => {
    render(<ActivityCalendar progress={createInitialProgress()} weeks={4} />)

    const headers = screen.getAllByRole('columnheader').map((cell) => cell.textContent)
    expect(headers).toEqual(['월', '월', '화', '수', '목', '금', '토', '일'])
  })

  it('학습한 날만 채우고 오늘을 따로 표시한다', () => {
    let progress = createInitialProgress()
    progress = recordReview(progress, 'one', 'known', new Date())
    progress = recordReview(progress, 'two', 'known', new Date(Date.now() - 86_400_000))

    const { container } = render(<ActivityCalendar progress={progress} weeks={4} />)

    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-today="true"]')).toHaveLength(1)
  })

  it('주 수만큼 칸을 만들고 아직 오지 않은 날은 비워둔다', () => {
    const { container } = render(<ActivityCalendar progress={createInitialProgress()} weeks={4} />)

    expect(container.querySelectorAll('.activity-day')).toHaveLength(28)
    // 이번 주의 남은 날은 칸만 두고 비운다. 오늘이 일요일이면 없을 수도 있다.
    expect(container.querySelectorAll('.activity-day--future').length).toBeLessThan(7)
  })

  it('기록이 없으면 학습한 날이 0으로 나온다', () => {
    const { container } = render(<ActivityCalendar progress={createInitialProgress()} weeks={4} />)

    // 요약과 캡션이 같은 숫자를 말한다.
    expect(container.querySelector('.progress-mini')?.textContent).toMatch(/0일 학습$/)
    expect(container.querySelector('caption')?.textContent).toMatch(/0일 학습했습니다/)
    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(0)
  })

  it('각 날짜에 학습 여부를 읽을 수 있는 이름을 준다', () => {
    const progress = recordReview(createInitialProgress(), 'one', 'known', new Date())
    const today = new Date()

    render(<ActivityCalendar progress={progress} weeks={4} />)

    expect(
      screen.getByLabelText(`${today.getMonth() + 1}월 ${today.getDate()}일 학습함`),
    ).toBeInTheDocument()
  })
})
