import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SoundToggle } from './SoundToggle'

describe('SoundToggle', () => {
  it('켜진 상태를 스위치로 알리고 누르면 끈다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => undefined)

    render(<SoundToggle preference="on" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: '카운트다운 소리' })
    expect(toggle).toBeChecked()
    expect(screen.getByText('켜짐')).toBeInTheDocument()

    await user.click(toggle)

    expect(onChange).toHaveBeenCalledWith('off')
  })

  it('꺼진 상태에서 누르면 켠다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => undefined)

    render(<SoundToggle preference="off" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: '카운트다운 소리' })
    expect(toggle).not.toBeChecked()
    expect(screen.getByText('꺼짐')).toBeInTheDocument()

    await user.click(toggle)

    expect(onChange).toHaveBeenCalledWith('on')
  })

  it('저장에 실패하면 알리고 다시 시도할 수 있다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => {
      throw new Error('storage unavailable')
    })

    render(<SoundToggle preference="on" onChange={onChange} />)
    await user.click(screen.getByRole('switch', { name: '카운트다운 소리' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요')
    expect(screen.getByRole('switch', { name: '카운트다운 소리' })).toBeEnabled()
  })
})
