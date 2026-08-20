import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { getLearnerLevel } from '../../domain/learning/progress'
import { LevelUpCelebration } from './LevelUpCelebration'

describe('LevelUpCelebration', () => {
  it('오른 레벨과 이름을 보여주고 확인 버튼에 초점을 준다', () => {
    render(<LevelUpCelebration levelNumber={3} level={getLearnerLevel(45)} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: '연결 설계자' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('LV3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '계속하기' })).toHaveFocus()
  })

  it('계속하기를 누르면 닫는다', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<LevelUpCelebration levelNumber={2} level={getLearnerLevel(25)} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: '계속하기' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Escape로도 닫을 수 있다', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<LevelUpCelebration levelNumber={2} level={getLearnerLevel(25)} onClose={onClose} />)

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
