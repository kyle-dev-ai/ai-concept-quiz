import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeSwitcher } from './ThemeSwitcher'

describe('ThemeSwitcher', () => {
  it('선택한 화면 모드를 저장하고 메뉴를 닫는다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => undefined)
    const { rerender } = render(<ThemeSwitcher preference="system" onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: '화면 모드: 기기 설정' }))
    expect(screen.getByRole('radiogroup', { name: '화면 모드 선택' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
      'light',
      'dark',
      'system',
    ])

    await user.click(screen.getByRole('radio', { name: '다크' }))
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('dark'))
    rerender(<ThemeSwitcher preference="dark" onChange={onChange} />)

    expect(screen.queryByRole('radiogroup', { name: '화면 모드 선택' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '화면 모드: 다크' })).toHaveFocus()
  })

  it('Escape와 바깥 탭으로 작은 메뉴를 닫는다', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher preference="system" onChange={async () => undefined} />)
    const trigger = screen.getByRole('button', { name: '화면 모드: 기기 설정' })

    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('radiogroup', { name: '화면 모드 선택' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('radiogroup', { name: '화면 모드 선택' })).not.toBeInTheDocument()
  })

  it('저장 실패를 메뉴 안에서 알리고 현재 선택을 유지한다', async () => {
    const user = userEvent.setup()
    render(
      <ThemeSwitcher
        preference="light"
        onChange={async () => {
          throw new Error('storage unavailable')
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: '화면 모드: 라이트' }))
    await user.click(screen.getByRole('radio', { name: '다크' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요')
    expect(screen.getByRole('radio', { name: '라이트' })).toBeChecked()
  })
})
