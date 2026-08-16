import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BottomNavigation } from './BottomNavigation'

describe('BottomNavigation', () => {
  it('네 destination과 현재 위치를 같은 dock에서 제공한다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<BottomNavigation activeTab="library" onChange={onChange} />)

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      '학습',
      '용어집',
      '기록',
      '프로필',
    ])
    expect(screen.getByRole('button', { name: '용어집' })).toHaveAttribute('aria-current', 'page')
    expect(container.querySelector('.bottom-navigation')).toHaveAttribute(
      'data-active-tab',
      'library',
    )

    await user.click(screen.getByRole('button', { name: '프로필' }))
    expect(onChange).toHaveBeenCalledWith('profile')
  })

  it('손가락을 누른 채 움직이면 물방울을 미리 보여주고 놓은 탭으로 이동한다', () => {
    const onChange = vi.fn()
    render(<BottomNavigation activeTab="learn" onChange={onChange} />)
    const navigation = screen.getByRole('navigation', { name: '주요 화면' })

    vi.spyOn(navigation, 'getBoundingClientRect').mockReturnValue({
      bottom: 72,
      height: 72,
      left: 0,
      right: 400,
      top: 0,
      width: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    navigation.setPointerCapture = vi.fn()
    navigation.hasPointerCapture = vi.fn(() => true)
    navigation.releasePointerCapture = vi.fn()

    fireEvent.pointerDown(navigation, {
      button: 0,
      clientX: 50,
      pointerId: 1,
      pointerType: 'touch',
    })
    expect(navigation.setPointerCapture).not.toHaveBeenCalled()

    fireEvent.pointerMove(navigation, {
      clientX: 350,
      pointerId: 1,
      pointerType: 'touch',
    })

    expect(navigation).toHaveAttribute('data-dragging', 'true')
    expect(navigation).toHaveAttribute('data-preview-tab', 'profile')
    expect(navigation.setPointerCapture).toHaveBeenCalledWith(1)
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.pointerUp(navigation, {
      clientX: 350,
      pointerId: 1,
      pointerType: 'touch',
    })

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('profile')
    expect(navigation).toHaveAttribute('data-dragging', 'false')
    expect(navigation).not.toHaveAttribute('data-preview-tab')
  })
})
