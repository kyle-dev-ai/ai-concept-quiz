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
  const saveThemePreference = vi.fn(async () => undefined)
  const applyTheme = vi.fn()
  const track = vi.fn()
  const setBadge = vi.fn()
  const saveSoundPreference = vi.fn(async () => undefined)
  const saveAnswerMode = vi.fn(async () => undefined)

  const dependencies: AppDependencies = {
    questions: { list: async () => sampleQuestions },
    profiles: { load: async () => null, save: saveProfile },
    progress: { load: async () => createInitialProgress(), save: saveProgress },
    themePreferences: { load: async () => 'light', save: saveThemePreference },
    themeController: { apply: applyTheme, dispose: vi.fn() },
    telemetry: { track, captureException: vi.fn() },
    challengeShare: { share: async () => 'copied' },
    bannerAds: { attach: () => () => undefined },
    speechRecognizer: { isSupported: false, start: () => ({ stop: () => undefined }) },
    appBadge: { set: setBadge },
    countdownCue: { prepare: vi.fn(), tick: vi.fn(), finish: vi.fn() },
    soundPreferences: { load: async () => 'on', save: saveSoundPreference },
    answerModes: { load: async () => 'spoken', save: saveAnswerMode },
  }

  return {
    dependencies,
    saveProfile,
    saveProgress,
    saveThemePreference,
    applyTheme,
    track,
    setBadge,
    saveSoundPreference,
    saveAnswerMode,
  }
}

describe('App learning flow', () => {
  it('최소 온보딩부터 답 공개, 자기평가, 점수 반영까지 이어진다', async () => {
    const user = userEvent.setup()
    const {
      dependencies,
      saveProfile,
      saveProgress,
      saveThemePreference,
      applyTheme,
      track,
      setBadge,
    } = createTestDependencies()
    render(<App dependencies={dependencies} />)

    expect(
      await screen.findByRole('heading', { name: 'What are you working toward?' }),
    ).toBeInTheDocument()
    expect(applyTheme).toHaveBeenCalledWith('light')

    await user.click(screen.getByRole('button', { name: '화면 모드: 라이트' }))
    await user.click(screen.getByRole('radio', { name: '다크' }))
    await waitFor(() => expect(saveThemePreference).toHaveBeenCalledWith('dark'))
    expect(applyTheme).toHaveBeenLastCalledWith('dark')
    expect(screen.getByRole('button', { name: '화면 모드: 다크' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: /대학원 준비·재학/ }))
    await user.type(
      screen.getByLabelText(/내 목표 한 줄/),
      '11월 구술에서 Attention을 설명하고 싶어요',
    )
    await user.click(screen.getByRole('button', { name: '저장하고 시작하기' }))

    // 홈 첫 화면은 오늘 상태에 따라 문장이 바뀐다. 아직 아무것도 안 한 상태다.
    expect(await screen.findByRole('heading', { name: '오늘 첫 개념' })).toBeInTheDocument()
    expect(screen.getByText(/좋은|늦은 밤|마무리/)).toBeInTheDocument()
    expect(saveProfile).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText('설명력 점수 0점, LV1 씨앗 질문가')).toHaveTextContent('0/100')
    // 오늘의 상태는 목표 링과 불꽃으로 보여준다.
    expect(screen.getByLabelText('오늘의 목표 5개 중 0개')).toBeInTheDocument()
    expect(screen.getByLabelText('연속 학습 0일, 오늘 아직')).toBeInTheDocument()

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

    // 답은 소리 내어 설명할 시간이 지난 뒤에만 열린다. 카운트다운 자체는
    // StudyScreen 단위 테스트에서 다루므로 여기서는 열릴 때까지 기다린다.
    expect(screen.getByRole('button', { name: /15초 뒤에 답을 볼 수 있어요/ })).toBeDisabled()
    await user.click(
      await screen.findByRole('button', { name: '답 확인하기' }, { timeout: 25_000 }),
    )

    expect(await screen.findByText('10초 핵심 답변')).toBeInTheDocument()
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'answer_revealed', questionId: expect.any(String) }),
    )

    await user.click(screen.getByRole('button', { name: /알았다/ }))
    await waitFor(() => expect(saveProgress).toHaveBeenCalled())
    expect(await screen.findByText('기록 완료')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '학습 마치기' }))

    expect(await screen.findByRole('heading', { name: /1개 개념을/ })).toBeInTheDocument()
    // 방금 본 문항은 복습 대기가 아니므로 배지는 0으로 정리된다.
    await waitFor(() => expect(setBadge).toHaveBeenLastCalledWith(0))
    // '알았다'로 기록한 문항의 다음 복습은 7일 뒤라 내일은 비어 있다.
    expect(screen.getByText('아직 예정 없음')).toBeInTheDocument()
    expect(screen.getByLabelText('연속 학습 1일')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '홈으로' }))
    expect(screen.getByLabelText('오늘의 목표 5개 중 1개')).toBeInTheDocument()
    expect(screen.getByLabelText('연속 학습 1일')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '기록' }))

    expect(screen.getByLabelText('설명력 점수 1점')).toBeInTheDocument()
    expect(
      screen.getByText('최근 자기평가로 계산한 학습 진도이며 시험·지능 점수가 아니에요.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '프로필' }))
    expect(screen.getByRole('heading', { name: 'Your deck. Your pace.' })).toBeInTheDocument()
    expect(screen.getByText('현재 학습자')).toBeInTheDocument()
    expect(screen.getAllByText('대학원 준비·재학').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: '학습 설정 변경' }))
    expect(
      await screen.findByRole('heading', { name: 'What are you working toward?' }),
    ).toBeInTheDocument()
    // 답 공개 카운트다운을 실제로 기다리므로 기본 timeout으로는 모자란다.
  }, 35_000)

  it('질문이나 기기 데이터 load 실패 시 복구 화면과 telemetry를 남긴다', async () => {
    const { dependencies } = createTestDependencies()
    const loadError = new Error('question bank unavailable')
    dependencies.questions.list = async () => {
      throw loadError
    }

    render(<App dependencies={dependencies} />)

    expect(
      await screen.findByRole('heading', {
        name: '연결 상태와 기기 저장소를 확인한 뒤 다시 시도해주세요.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다시 불러오기' })).toBeInTheDocument()
    expect(dependencies.telemetry.captureException).toHaveBeenCalledWith(loadError, {
      area: 'bootstrap',
      operation: 'load',
    })
  })
})
