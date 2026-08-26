import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AnswerModeToggle } from './AnswerModeToggle'

describe('AnswerModeToggle', () => {
  it('소리 내어 말하는 기본 상태에서 누르면 무음으로 바꾼다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => undefined)

    render(<AnswerModeToggle mode="spoken" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: '무음 모드' })
    expect(toggle).not.toBeChecked()

    await user.click(toggle)

    expect(onChange).toHaveBeenCalledWith('silent')
  })

  it('무음 상태에서 누르면 다시 소리 내어 말하기로 돌아간다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => undefined)

    render(<AnswerModeToggle mode="silent" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: '무음 모드' })
    expect(toggle).toBeChecked()

    await user.click(toggle)

    expect(onChange).toHaveBeenCalledWith('spoken')
  })

  it('저장에 실패하면 알리고 다시 시도할 수 있다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => {
      throw new Error('storage unavailable')
    })

    render(<AnswerModeToggle mode="spoken" onChange={onChange} />)
    await user.click(screen.getByRole('switch', { name: '무음 모드' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요')
    expect(screen.getByRole('switch', { name: '무음 모드' })).toBeEnabled()
  })
})
