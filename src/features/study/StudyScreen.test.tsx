import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SpeechHandlers, SpeechRecognizer } from '../../application/ports/speech-recognizer'
import { sampleQuestions } from '../../content/sample-questions'
import { StudyScreen } from './StudyScreen'

function silentSpeech(): SpeechRecognizer {
  return { isSupported: true, start: () => ({ stop: () => undefined }) }
}

function speechSaying(transcript: string, alternatives: readonly string[] = []): SpeechRecognizer {
  return {
    isSupported: true,
    start: (handlers: SpeechHandlers) => {
      handlers.onTranscript(transcript, alternatives)
      return { stop: () => undefined }
    },
  }
}

function firstQuestion() {
  const question = sampleQuestions[0]
  if (question === undefined) {
    throw new Error('test question is missing')
  }
  return question
}

function renderScreen(overrides: Partial<Parameters<typeof StudyScreen>[0]> = {}) {
  return render(
    <StudyScreen
      question={firstQuestion()}
      index={0}
      total={1}
      scopeLabel="테스트"
      adsEnabled={false}
      bannerAds={{ attach: () => () => undefined }}
      speech={silentSpeech()}
      countdownCue={{ prepare: vi.fn(), tick: vi.fn(), finish: vi.fn() }}
      revealDelaySeconds={0}
      onExit={vi.fn()}
      onReveal={vi.fn()}
      onRate={vi.fn(async () => undefined)}
      onNext={vi.fn()}
      onShare={async () => 'unavailable'}
      {...overrides}
    />,
  )
}

afterEach(() => {
  vi.useRealTimers()
})

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

    renderScreen({ onRate })

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

    renderScreen({ onRate })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    await user.click(screen.getByRole('button', { name: /알았다/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('기록하지 못했어요')
    expect(screen.queryByText('기록 완료')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /알았다/ })).toBeEnabled()
  })

  it('말할 시간이 지나기 전에는 답을 열 수 없다', async () => {
    vi.useFakeTimers()
    renderScreen({ revealDelaySeconds: 3 })

    expect(screen.getByRole('button', { name: /3초 뒤에 답을 볼 수 있어요/ })).toBeDisabled()

    // 다음 tick은 재렌더 뒤에 예약되므로 1초씩 진행한다.
    for (const remaining of [2, 1]) {
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
      expect(
        screen.getByRole('button', { name: `${remaining}초 뒤에 답을 볼 수 있어요` }),
      ).toBeDisabled()
    }

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('button', { name: '답 확인하기' })).toBeEnabled()
  })

  it('말한 내용과 모범 답의 유사도를 보여준다', async () => {
    const user = userEvent.setup()
    const question = firstQuestion()

    renderScreen({ speech: speechSaying(question.shortAnswer) })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.getByText('말한 답과 모범 답 유사도')).toBeInTheDocument()
    // 모범 답을 그대로 말했으므로 유사도는 100%다.
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('짚은 핵심 포인트와 놓친 핵심 포인트를 나눠 보여준다', async () => {
    const user = userEvent.setup()
    const question = firstQuestion()
    const [firstPoint] = question.keyPoints

    renderScreen({ speech: speechSaying(firstPoint) })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.getAllByText('말했음')).toHaveLength(1)
    expect(screen.getAllByText('못 말했음')).toHaveLength(question.keyPoints.length - 1)
  })

  it('아무 말도 인식되지 않으면 유사도 패널을 띄우지 않는다', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.queryByText('말한 답과 모범 답 유사도')).not.toBeInTheDocument()
  })

  it('음성 인식을 지원하지 않으면 안내만 하고 학습은 그대로 진행된다', async () => {
    const user = userEvent.setup()
    const speech: SpeechRecognizer = {
      isSupported: false,
      start: () => ({ stop: () => undefined }),
    }

    renderScreen({ speech })

    expect(screen.getByText(/음성 인식을 지원하지 않아요/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    expect(screen.getByRole('button', { name: /알았다/ })).toBeEnabled()
  })

  it('마이크 권한이 거부되면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup()
    let attempts = 0
    const speech: SpeechRecognizer = {
      isSupported: true,
      start: (handlers: SpeechHandlers) => {
        attempts += 1
        if (attempts === 1) {
          handlers.onFailure('denied')
        }
        return { stop: () => undefined }
      },
    }

    renderScreen({ speech })

    expect(screen.getByText(/마이크 권한이 꺼져 있어요/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '다시 시도' }))

    expect(attempts).toBe(2)
    expect(screen.queryByText(/마이크 권한이 꺼져 있어요/)).not.toBeInTheDocument()
  })

  it('마지막 5초에 들어서면 버튼을 붉게 강조하고 초마다 짙어진다', async () => {
    vi.useFakeTimers()
    renderScreen({ revealDelaySeconds: 7 })

    // 7초, 6초는 아직 평상시 상태다.
    expect(screen.getByRole('button', { name: /7초 뒤에/ })).not.toHaveAttribute('data-urgency')
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('button', { name: /6초 뒤에/ })).not.toHaveAttribute('data-urgency')

    // 5초부터 강조가 시작되고, 초가 줄수록 단계가 올라간다.
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('button', { name: /5초 뒤에/ })).toHaveAttribute('data-urgency', '5')

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })
    const lastSecond = screen.getByRole('button', { name: /2초 뒤에/ })
    expect(lastSecond).toHaveAttribute('data-urgency', '2')

    // 남은 초가 줄수록 맥박이 빨라진다.
    expect(lastSecond.style.getPropertyValue('--countdown-pulse')).toBe('520ms')
  })

  it('마지막 네 초를 소리로 세고 답이 열릴 때 마무리 소리를 낸다', async () => {
    vi.useFakeTimers()
    const countdownCue = { prepare: vi.fn(), tick: vi.fn(), finish: vi.fn() }
    renderScreen({ revealDelaySeconds: 7, countdownCue })

    // 초마다 렌더가 일어나야 매초를 세므로 1초씩 진행한다.
    async function advanceOneSecond() {
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
    }

    // 7 → 5 구간에서는 아직 조용하다.
    await advanceOneSecond()
    await advanceOneSecond()
    expect(countdownCue.tick).not.toHaveBeenCalled()

    // 4, 3, 2, 1 네 번의 뜨.
    for (let count = 0; count < 4; count += 1) {
      await advanceOneSecond()
    }
    expect(countdownCue.tick).toHaveBeenCalledTimes(4)
    expect(countdownCue.finish).not.toHaveBeenCalled()

    // 0이 되는 순간의 뜬!
    await advanceOneSecond()
    expect(countdownCue.finish).toHaveBeenCalledTimes(1)
    expect(countdownCue.tick).toHaveBeenCalledTimes(4)
  })

  it('기다릴 시간이 없으면 소리를 내지 않는다', () => {
    const countdownCue = { prepare: vi.fn(), tick: vi.fn(), finish: vi.fn() }
    renderScreen({ revealDelaySeconds: 0, countdownCue })

    expect(countdownCue.tick).not.toHaveBeenCalled()
    expect(countdownCue.finish).not.toHaveBeenCalled()
  })

  it('소리를 끄면 카운트다운이 조용히 흐른다', async () => {
    vi.useFakeTimers()
    const countdownCue = { prepare: vi.fn(), tick: vi.fn(), finish: vi.fn() }
    renderScreen({ revealDelaySeconds: 3, countdownCue, soundEnabled: false })

    for (let count = 0; count < 3; count += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
    }

    expect(countdownCue.tick).not.toHaveBeenCalled()
    expect(countdownCue.finish).not.toHaveBeenCalled()
    // 소리만 빠지고 시각적 카운트다운과 잠금 해제는 그대로다.
    expect(screen.getByRole('button', { name: '답 확인하기' })).toBeEnabled()
  })

  it('지난번에 놓친 포인트를 이번에 말하면 따로 짚어준다', async () => {
    const user = userEvent.setup()
    const question = firstQuestion()
    const [firstPoint] = question.keyPoints

    renderScreen({
      speech: speechSaying(firstPoint),
      previouslyMissedKeyPoints: [firstPoint],
    })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.getByText(/지난번 놓친 포인트 1개를 이번엔 말했어요/)).toBeInTheDocument()
  })

  it('처음 보는 문항에서는 극복 문구를 띄우지 않는다', async () => {
    const user = userEvent.setup()
    const question = firstQuestion()
    const [firstPoint] = question.keyPoints

    renderScreen({ speech: speechSaying(firstPoint) })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.queryByText(/이번엔 말했어요/)).not.toBeInTheDocument()
  })

  it('공유 버튼으로 문제를 내보낼 수 있다', async () => {
    const user = userEvent.setup()
    const onShare = vi.fn(async () => 'copied' as const)

    renderScreen({ onShare })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))
    await user.click(screen.getByRole('button', { name: /알았다/ }))
    await user.click(await screen.findByRole('button', { name: '친구에게 문제 내기' }))

    expect(onShare).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('문제와 링크를 복사했어요.')).toBeInTheDocument()
  })

  it('첫 후보가 뭉개졌어도 더 잘 맞는 후보로 점수를 낸다', async () => {
    const user = userEvent.setup()
    const question = firstQuestion()

    // 인식기가 첫 후보를 엉뚱하게 적고, 두 번째 후보에 제대로 담은 상황.
    renderScreen({ speech: speechSaying('에레렘 어쩌구', [question.shortAnswer]) })

    await user.click(screen.getByRole('button', { name: '답 확인하기' }))

    expect(screen.getByText('100')).toBeInTheDocument()
  })
})
