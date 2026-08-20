import { type ReactNode, useEffect, useRef, useState } from 'react'
import { runtimeConfig } from './app/config/runtime-config'
import type { AppDependencies } from './app/dependencies'
import { appDependencies } from './app/dependencies'
import { dailyQuotes } from './content/daily-quotes'
import { type LearningGoalId, learningGoalById } from './domain/learning/goal'
import {
  createLearnerProfile,
  type LearnerProfile,
  learnerGroupById,
} from './domain/learning/learner-profile'
import {
  calculateMasteryScore,
  calculateStreak,
  createInitialProgress,
  getLearnerLevel,
  getLearnerLevelNumber,
  type KnowledgeRating,
  type LearningProgress,
  recordReview,
  type SpokenAttempt,
  withSelectedGoal,
} from './domain/learning/progress'
import { categoryById, type StudyQuestion, type StudyScope } from './domain/learning/question'
import { countDueOn, nextDay, planReview } from './domain/learning/review'
import { createStudyQueue, weakQuestions } from './domain/learning/session'
import type { SoundPreference } from './domain/preferences/sound'
import type { ThemePreference } from './domain/preferences/theme'
import { OnboardingScreen, type OnboardingValue } from './features/goal-selector/OnboardingScreen'
import { LibraryScreen } from './features/library/LibraryScreen'
import { ThemeSwitcher } from './features/preferences/ThemeSwitcher'
import { ProfileScreen } from './features/profile/ProfileScreen'
import { LevelUpCelebration } from './features/progress/LevelUpCelebration'
import { ProgressScreen } from './features/progress/ProgressScreen'
import { StudyComplete } from './features/study/StudyComplete'
import { StudyHome } from './features/study/StudyHome'
import { StudyScreen } from './features/study/StudyScreen'
import { type AppTab, BottomNavigation } from './shared/components/BottomNavigation'
import './App.css'

interface AppProps {
  readonly dependencies?: AppDependencies
}

type SessionSource =
  | { readonly kind: 'scope'; readonly scope: StudyScope }
  | { readonly kind: 'daily' | 'single'; readonly question: StudyQuestion }

interface StudySession {
  readonly source: SessionSource
  readonly queue: readonly StudyQuestion[]
  readonly index: number
  readonly label: string
  readonly reviewedCount: number
  /** 이번 세션에서 기록된 발화 유사도. 음성 인식을 쓴 문항만 담긴다. */
  readonly similarities: readonly number[]
  /** 이번 세션에서 개인 최고 유사도를 넘긴 횟수. */
  readonly recordsBroken: number
  readonly completed: boolean
}

function App({ dependencies = appDependencies }: AppProps) {
  const [questions, setQuestions] = useState<readonly StudyQuestion[]>([])
  const [profile, setProfile] = useState<LearnerProfile | null>(null)
  const [progress, setProgress] = useState<LearningProgress>(createInitialProgress)
  const [activeTab, setActiveTab] = useState<AppTab>('learn')
  const [session, setSession] = useState<StudySession | null>(null)
  const [themePreference, setThemePreference] = useState<ThemePreference>('light')
  const [soundPreference, setSoundPreference] = useState<SoundPreference>('on')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [celebratedLevel, setCelebratedLevel] = useState<number | null>(null)
  // 처음 불러온 값은 축하 대상이 아니다. 앱을 쓰는 동안 올라간 것만 기린다.
  const lastLevelRef = useRef<number | null>(null)
  const lastStreakRef = useRef<number | null>(null)
  const viewIdentity = `${activeTab}:${isEditingProfile ? 'editing' : 'viewing'}:${profile === null ? 'onboarding' : 'profile'}:${session?.index ?? 'none'}:${session?.completed === true ? 'complete' : 'active'}`

  useEffect(() => {
    let isActive = true

    Promise.all([
      dependencies.questions.list(),
      dependencies.profiles.load(),
      dependencies.progress.load(),
      dependencies.themePreferences.load(),
      dependencies.soundPreferences.load(),
    ])
      .then(
        ([
          loadedQuestions,
          loadedProfile,
          loadedProgress,
          loadedThemePreference,
          loadedSoundPreference,
        ]) => {
          if (!isActive) {
            return
          }

          const alignedProgress =
            loadedProfile === null || loadedProgress.selectedGoal === loadedProfile.learningGoalId
              ? loadedProgress
              : withSelectedGoal(loadedProgress, loadedProfile.learningGoalId)

          setQuestions(loadedQuestions)
          setProfile(loadedProfile)
          setProgress(alignedProgress)
          dependencies.themeController.apply(loadedThemePreference)
          setThemePreference(loadedThemePreference)
          setSoundPreference(loadedSoundPreference)
          setIsReady(true)

          if (alignedProgress !== loadedProgress) {
            void dependencies.progress.save(alignedProgress).catch((error: unknown) => {
              dependencies.telemetry.captureException(error, {
                area: 'progress',
                operation: 'align-goal',
              })
            })
          }
        },
      )
      .catch((error: unknown) => {
        dependencies.telemetry.captureException(error, { area: 'bootstrap', operation: 'load' })
        if (isActive) {
          setLoadError(true)
          setIsReady(true)
        }
      })

    return () => {
      isActive = false
      dependencies.themeController.dispose()
    }
  }, [dependencies])

  useEffect(() => {
    if (viewIdentity.length === 0) {
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [viewIdentity])

  const masteryScore = calculateMasteryScore(progress, questions.length)
  const streak = calculateStreak(progress)
  const streakJustGrew = lastStreakRef.current !== null && streak > lastStreakRef.current

  // 레벨이 오른 순간에만 축하를 띄운다.
  useEffect(() => {
    if (!isReady || loadError || questions.length === 0) {
      return
    }

    const levelNumber = getLearnerLevelNumber(masteryScore)
    if (lastLevelRef.current !== null && levelNumber > lastLevelRef.current) {
      setCelebratedLevel(levelNumber)
    }
    lastLevelRef.current = levelNumber
  }, [isReady, loadError, masteryScore, questions.length])

  useEffect(() => {
    if (!isReady || loadError) {
      return
    }
    lastStreakRef.current = streak
  }, [isReady, loadError, streak])

  // 홈화면에 설치했을 때 밀린 복습 수를 아이콘 배지로 알린다.
  // 설치하지 않았거나 지원하지 않는 환경에서는 어댑터가 조용히 넘긴다.
  useEffect(() => {
    if (!isReady || loadError) {
      return
    }
    dependencies.appBadge.set(planReview(questions, progress).due.length)
  }, [dependencies.appBadge, isReady, loadError, progress, questions])

  async function completeOnboarding(value: OnboardingValue) {
    const isUpdatingProfile = profile !== null
    const nextProfile = createLearnerProfile({
      ...value,
      createdAt: profile === null ? undefined : new Date(profile.createdAt),
    })
    const nextProgress = withSelectedGoal(progress, value.learningGoalId)

    try {
      await Promise.all([
        dependencies.profiles.save(nextProfile),
        dependencies.progress.save(nextProgress),
      ])
    } catch (error) {
      dependencies.telemetry.captureException(error, { area: 'onboarding', operation: 'save' })
      throw error
    }

    setProfile(nextProfile)
    setProgress(nextProgress)
    setIsEditingProfile(false)
    setActiveTab(isUpdatingProfile ? 'profile' : 'learn')
  }

  async function changeTheme(nextPreference: ThemePreference): Promise<void> {
    if (nextPreference === themePreference) {
      return
    }

    try {
      await dependencies.themePreferences.save(nextPreference)
      dependencies.themeController.apply(nextPreference)
    } catch (error) {
      dependencies.telemetry.captureException(error, { area: 'appearance', operation: 'save' })
      throw error
    }

    setThemePreference(nextPreference)
  }

  async function changeSoundPreference(nextPreference: SoundPreference): Promise<void> {
    if (nextPreference === soundPreference) {
      return
    }

    try {
      await dependencies.soundPreferences.save(nextPreference)
    } catch (error) {
      dependencies.telemetry.captureException(error, { area: 'appearance', operation: 'save' })
      throw error
    }

    setSoundPreference(nextPreference)
  }

  function withThemeSwitcher(screen: ReactNode) {
    return (
      <>
        <ThemeSwitcher preference={themePreference} disabled={!isReady} onChange={changeTheme} />
        {screen}
      </>
    )
  }

  async function changeGoal(goalId: LearningGoalId): Promise<void> {
    if (profile === null) {
      return
    }

    const nextProfile = { ...profile, learningGoalId: goalId }
    const nextProgress = withSelectedGoal(progress, goalId)

    try {
      await Promise.all([
        dependencies.profiles.save(nextProfile),
        dependencies.progress.save(nextProgress),
      ])
    } catch (error) {
      dependencies.telemetry.captureException(error, { area: 'goal', operation: 'save' })
      throw error
    }

    setProfile(nextProfile)
    setProgress(nextProgress)
    dependencies.telemetry.track({ name: 'goal_selected', goalId })
  }

  function labelForScope(scope: StudyScope): string {
    if (scope === 'recommended') {
      return `${learningGoalById[profile?.learningGoalId ?? 'ai-basics'].shortLabel} 추천`
    }
    if (scope === 'all') {
      return '전체 랜덤'
    }
    if (scope === 'weak') {
      return '약점 다시 말하기'
    }
    return categoryById[scope].label
  }

  function startScope(scope: StudyScope) {
    if (profile === null) {
      return
    }

    // 브라우저는 사용자 조작 안에서만 오디오 시작을 허용한다.
    dependencies.countdownCue.prepare()

    const queue = createStudyQueue(
      questions,
      scope,
      learningGoalById[profile.learningGoalId],
      learnerGroupById[profile.groupId],
      Math.random,
      progress,
    )

    if (queue.length === 0) {
      return
    }

    setSession({
      source: { kind: 'scope', scope },
      queue,
      index: 0,
      label: labelForScope(scope),
      reviewedCount: 0,
      similarities: [],
      recordsBroken: 0,
      completed: false,
    })
    dependencies.telemetry.track({ name: 'study_started', scope, questionCount: queue.length })
  }

  function startSingle(question: StudyQuestion, kind: 'daily' | 'single' = 'single') {
    dependencies.countdownCue.prepare()
    setSession({
      source: { kind, question },
      queue: [question],
      index: 0,
      label: kind === 'daily' ? '오늘의 10초 구술' : '다시 설명하기',
      reviewedCount: 0,
      similarities: [],
      recordsBroken: 0,
      completed: false,
    })
    dependencies.telemetry.track({ name: 'study_started', scope: kind, questionCount: 1 })
  }

  async function rateCurrentQuestion(
    rating: KnowledgeRating,
    attempt?: SpokenAttempt,
  ): Promise<void> {
    if (session === null) {
      return
    }
    const question = session.queue[session.index]
    if (question === undefined) {
      return
    }

    const previousBest = progress.questions[question.id]?.bestSimilarity ?? 0
    const nextProgress = recordReview(progress, question.id, rating, new Date(), attempt)
    try {
      await dependencies.progress.save(nextProgress)
    } catch (error) {
      dependencies.telemetry.captureException(error, { area: 'progress', operation: 'rate' })
      throw error
    }

    setProgress(nextProgress)
    setSession((currentSession) => {
      const currentQuestion = currentSession?.queue[currentSession.index]
      if (currentSession === null || currentQuestion?.id !== question.id) {
        return currentSession
      }
      return {
        ...currentSession,
        reviewedCount: currentSession.reviewedCount + 1,
        similarities:
          attempt === undefined
            ? currentSession.similarities
            : [...currentSession.similarities, attempt.similarity],
        recordsBroken:
          attempt !== undefined && attempt.similarity > previousBest
            ? currentSession.recordsBroken + 1
            : currentSession.recordsBroken,
      }
    })
    dependencies.telemetry.track({
      name: 'review_recorded',
      questionId: question.id,
      rating,
    })
  }

  function revealCurrentQuestion() {
    const question = session?.queue[session.index]
    if (question === undefined) {
      return
    }

    dependencies.telemetry.track({
      name: 'answer_revealed',
      questionId: question.id,
    })
  }

  function nextQuestion() {
    if (session === null) {
      return
    }

    if (session.index + 1 >= session.queue.length) {
      setSession({ ...session, completed: true })
      return
    }

    setSession({ ...session, index: session.index + 1 })
  }

  async function shareCurrentQuestion() {
    const question = session?.queue[session.index]
    if (question === undefined) {
      return 'unavailable' as const
    }

    const result = await dependencies.challengeShare.share(question)
    if (result === 'shared' || result === 'copied') {
      dependencies.telemetry.track({
        name: 'challenge_shared',
        questionId: question.id,
        method: result,
      })
    }
    return result
  }

  function restartSession() {
    const source = session?.source
    if (source === undefined) {
      return
    }

    if (source.kind === 'scope') {
      startScope(source.scope)
    } else {
      startSingle(source.question, source.kind)
    }
  }

  function goHome() {
    setSession(null)
    setActiveTab('learn')
  }

  if (!isReady) {
    return withThemeSwitcher(
      <main className="loading-screen" aria-busy="true">
        <span className="brand-mark">A!</span>
        <p>오늘의 질문을 섞고 있어요</p>
        <div aria-hidden="true">
          <i className="loading-node" />
          <i className="loading-node loading-node--middle" />
          <i className="loading-node loading-node--last" />
        </div>
      </main>,
    )
  }

  if (loadError) {
    return withThemeSwitcher(
      <main className="fatal-error">
        <span className="eyebrow">불러오지 못했어요</span>
        <h1>연결 상태와 기기 저장소를 확인한 뒤 다시 시도해주세요.</h1>
        <button type="button" className="button button--primary" onClick={() => location.reload()}>
          다시 불러오기
        </button>
      </main>,
    )
  }

  if (profile === null || isEditingProfile) {
    return withThemeSwitcher(
      <OnboardingScreen
        initialProfile={profile ?? undefined}
        onComplete={completeOnboarding}
        onCancel={profile === null ? undefined : () => setIsEditingProfile(false)}
      />,
    )
  }

  if (session !== null) {
    const question = session.queue[session.index]
    if (session.completed || question === undefined) {
      return withThemeSwitcher(
        <StudyComplete
          reviewedCount={session.reviewedCount}
          streak={calculateStreak(progress)}
          masteryScore={masteryScore}
          level={getLearnerLevel(masteryScore)}
          dueTomorrow={countDueOn(questions, progress, nextDay(new Date()))}
          similarities={session.similarities}
          recordsBroken={session.recordsBroken}
          weakCount={weakQuestions(questions, progress).length}
          onStartWeak={() => startScope('weak')}
          adsEnabled={runtimeConfig.adsEnabled}
          bannerAds={dependencies.bannerAds}
          onRestart={restartSession}
          onHome={goHome}
        />,
      )
    }

    return withThemeSwitcher(
      <StudyScreen
        key={question.id}
        question={question}
        index={session.index}
        total={session.queue.length}
        scopeLabel={session.label}
        adsEnabled={runtimeConfig.adsEnabled}
        bannerAds={dependencies.bannerAds}
        speech={dependencies.speechRecognizer}
        countdownCue={dependencies.countdownCue}
        soundEnabled={soundPreference === 'on'}
        bestSimilarity={progress.questions[question.id]?.bestSimilarity ?? 0}
        previouslyMissedKeyPoints={progress.questions[question.id]?.missedKeyPoints}
        onExit={() => setSession(null)}
        onReveal={revealCurrentQuestion}
        onRate={rateCurrentQuestion}
        onNext={nextQuestion}
        onShare={shareCurrentQuestion}
      />,
    )
  }

  return withThemeSwitcher(
    <div className="app-shell">
      {activeTab === 'learn' ? (
        <StudyHome
          questions={questions}
          profile={profile}
          progress={progress}
          adsEnabled={runtimeConfig.adsEnabled}
          bannerAds={dependencies.bannerAds}
          onGoalChange={changeGoal}
          onStart={startScope}
          onStartDaily={(question) => startSingle(question, 'daily')}
          streakJustGrew={streakJustGrew}
          quotes={dailyQuotes}
        />
      ) : null}
      {activeTab === 'library' ? (
        <LibraryScreen
          questions={questions}
          progress={progress}
          adsEnabled={runtimeConfig.adsEnabled}
          bannerAds={dependencies.bannerAds}
          onStudyCategory={startScope}
        />
      ) : null}
      {activeTab === 'progress' ? (
        <ProgressScreen
          profile={profile}
          progress={progress}
          questions={questions}
          adsEnabled={runtimeConfig.adsEnabled}
          bannerAds={dependencies.bannerAds}
          onStudyQuestion={startSingle}
        />
      ) : null}
      {activeTab === 'profile' ? (
        <ProfileScreen
          profile={profile}
          adsEnabled={runtimeConfig.adsEnabled}
          bannerAds={dependencies.bannerAds}
          soundPreference={soundPreference}
          onSoundChange={changeSoundPreference}
          onEdit={() => setIsEditingProfile(true)}
        />
      ) : null}
      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
      {celebratedLevel === null ? null : (
        <LevelUpCelebration
          levelNumber={celebratedLevel}
          level={getLearnerLevel(masteryScore)}
          onClose={() => setCelebratedLevel(null)}
        />
      )}
    </div>,
  )
}

export default App
