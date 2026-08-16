import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GoalSelector } from './GoalSelector'

describe('GoalSelector', () => {
  it('목표 저장이 실패하면 기존 선택을 유지하고 재시도를 안내한다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => {
      throw new Error('storage unavailable')
    })
    render(<GoalSelector selectedGoal="graduate-school" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: '이직' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('목표를 저장하지 못했어요')
    expect(screen.getByRole('radio', { name: '대학원' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '이직' })).toBeEnabled()
  })
})
