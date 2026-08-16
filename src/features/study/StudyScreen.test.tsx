import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { sampleQuestions } from '../../content/sample-questions'
import { StudyScreen } from './StudyScreen'

describe('StudyScreen', () => {
  it('누른 자기평가만 저장 중 반응을 보이고 완료 뒤 확정한다', async () => {
    const user = userEvent.setup()
    let finishSave: (() => void) | undefined
    const onRate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve
        }),
    )
    const question = sampleQuestions[0]
    if (question === undefined) {
      throw new Error('test question is missing')
    }

    render(
      <StudyScreen
        question={question}
        index={0}
        total={1}
        scopeLabel="테스트"
        adsEnabled={false}
        bannerAds={{ attach: () => () => undefined }}
        onExit={vi.fn()}
        onReveal={vi.fn()}
        onRate={onRate}
        onNext={vi.fn()}
        onShare={async () => 'unavailable'}
      />,
    )

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    const knownButton = screen.getByRole('button', { name: /알았다/ })
    await user.click(knownButton)

    expect(knownButton).toHaveAttribute('data-pending', 'true')
    expect(screen.getByRole('button', { name: /몰랐다/ })).toHaveAttribute('data-dimmed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('기록하는 중')

    finishSave?.()
    expect(await screen.findByText('기록 완료')).toBeInTheDocument()
  })

  it('자기평가 저장이 실패하면 완료로 표시하지 않고 다시 누를 수 있다', async () => {
    const user = userEvent.setup()
    const onRate = vi.fn(async () => {
      throw new Error('storage unavailable')
    })
    const question = sampleQuestions[0]
    if (question === undefined) {
      throw new Error('test question is missing')
    }

    render(
      <StudyScreen
        question={question}
        index={0}
        total={1}
        scopeLabel="테스트"
        adsEnabled={false}
        bannerAds={{ attach: () => () => undefined }}
        onExit={vi.fn()}
        onReveal={vi.fn()}
        onRate={onRate}
        onNext={vi.fn()}
        onShare={async () => 'unavailable'}
      />,
    )

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    await user.click(screen.getByRole('button', { name: /알았다/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('기록하지 못했어요')
    expect(screen.queryByText('기록 완료')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /알았다/ })).toBeEnabled()
  })
})
