import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import type { AppDependencies } from './app/dependencies'
import { sampleQuestions } from './content/sample-questions'
import { createInitialProgress } from './domain/learning/progress'

function createTestDependencies() {
  const saveProfile = vi.fn(async () => undefined)
  const saveProgress = vi.fn(async () => undefined)
  const track = vi.fn()

  const dependencies: AppDependencies = {
    questions: { list: async () => sampleQuestions },
    profiles: { load: async () => null, save: saveProfile },
    progress: { load: async () => createInitialProgress(), save: saveProgress },
    telemetry: { track, captureException: vi.fn() },
    challengeShare: { share: async () => 'copied' },
  }

  return { dependencies, saveProfile, saveProgress, track }
}

describe('App learning flow', () => {
  it('최소 온보딩부터 답 공개, 자기평가, 점수 반영까지 이어진다', async () => {
    const user = userEvent.setup()
    const { dependencies, saveProfile, saveProgress, track } = createTestDependencies()
    render(<App dependencies={dependencies} />)

    expect(
      await screen.findByRole('heading', { name: 'What are you working toward?' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /대학원 준비·재학/ }))
    await user.type(
      screen.getByLabelText(/내 목표 한 줄/),
      '11월 구술에서 Attention을 설명하고 싶어요',
    )
    await user.click(screen.getByRole('button', { name: '저장하고 시작하기' }))

    expect(await screen.findByRole('heading', { name: 'Can you explain it?' })).toBeInTheDocument()
    expect(saveProfile).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText('연속 학습 0일')).toHaveTextContent('0/100')

    await user.click(screen.getByRole('button', { name: /레벨 안내 열기/ }))
    const levelGuide = screen.getByRole('dialog', { name: 'Your level map' })
    expect(screen.getByRole('button', { name: '레벨 안내 닫기' })).toHaveFocus()
    expect(levelGuide).toHaveTextContent('LV1')
    expect(levelGuide).toHaveTextContent('LV5')
    expect(levelGuide).toHaveTextContent('씨앗 질문가')
    await user.click(screen.getByRole('button', { name: 'LV1에서 계속하기' }))
    expect(screen.queryByRole('dialog', { name: 'Your level map' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /레벨 안내 열기/ })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: /오늘의 10초 구술/ }))
    expect(screen.queryByText('10초 핵심 답변')).not.toBeInTheDocument()
    expect(document.querySelector('[data-ad-placement="study-bottom-banner"]')).toBeNull()

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    expect(await screen.findByText('10초 핵심 답변')).toBeInTheDocument()
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'answer_revealed', questionId: expect.any(String) }),
    )

    await user.click(screen.getByRole('button', { name: /알았다/ }))
    await waitFor(() => expect(saveProgress).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: '학습 마치기' }))

    expect(await screen.findByRole('heading', { name: /1개 개념을/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '홈으로' }))
    await user.click(screen.getByRole('button', { name: '기록' }))

    expect(screen.getByLabelText('설명력 점수 3점')).toBeInTheDocument()
    expect(
      screen.getByText('최근 자기평가로 계산한 학습 진도이며 시험·지능 점수가 아니에요.'),
    ).toBeInTheDocument()
  })
})
