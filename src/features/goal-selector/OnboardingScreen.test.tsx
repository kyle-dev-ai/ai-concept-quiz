import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OnboardingScreen } from './OnboardingScreen'

describe('OnboardingScreen', () => {
  it('기기 저장이 실패하면 화면을 유지하고 다시 시도할 수 있게 알린다', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn(async () => {
      throw new Error('storage unavailable')
    })
    render(<OnboardingScreen onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: /대학원 준비·재학/ }))
    await user.click(screen.getByRole('button', { name: '저장하고 시작하기' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했어요')
    expect(screen.getByRole('button', { name: '저장하고 시작하기' })).toBeEnabled()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
