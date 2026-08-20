import { type CSSProperties, useState } from 'react'
import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import { dailyBriefing } from '../../domain/learning/briefing'
import { type LearningGoalId, learningGoalById } from '../../domain/learning/goal'
import { type LearnerProfile, learnerGroupById } from '../../domain/learning/learner-profile'
import {
  calculateMasteryScore,
  calculateStreak,
  countReviewedOn,
  dailyReviewGoal,
  getLearnerLevel,
  getLearnerLevelNumber,
  hasStudiedToday,
  type LearningProgress,
  summarizeProgress,
} from '../../domain/learning/progress'
import {
  categories,
  categoryById,
  type StudyQuestion,
  type StudyScope,
} from '../../domain/learning/question'
import { planReview } from '../../domain/learning/review'
import {
  getDailyQuestion,
  maxSessionLength,
  questionsForScope,
  weakQuestions,
} from '../../domain/learning/session'
import { CountUpNumber } from '../../shared/components/CountUpNumber'
import { ProgressRing } from '../../shared/components/ProgressRing'
import { StudyBuddy } from '../../shared/components/StudyBuddy'
import { useInView } from '../../shared/components/useInView'
import { GoalSelector } from '../goal-selector/GoalSelector'
import { AdSlot } from '../monetization/AdSlot'
import { LevelGuideSheet } from '../progress/LevelGuideSheet'

interface StudyHomeProps {
  readonly questions: readonly StudyQuestion[]
  readonly profile: LearnerProfile
  readonly progress: LearningProgress
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onGoalChange: (goalId: LearningGoalId) => Promise<void>
  readonly onStart: (scope: StudyScope) => void
  readonly onStartDaily: (question: StudyQuestion) => void
  /** 방금 연속 기록이 하루 늘었는지. 불꽃을 한 번 터뜨릴 때 쓴다. */
  readonly streakJustGrew?: boolean
}

export function StudyHome({
  questions,
  profile,
  progress,
  adsEnabled,
  bannerAds,
  onGoalChange,
  onStart,
  onStartDaily,
  streakJustGrew = false,
}: StudyHomeProps) {
  const goal = learningGoalById[profile.learningGoalId]
  const learnerGroup = learnerGroupById[profile.groupId]
  const recommendedQuestions = questionsForScope(questions, 'recommended', goal, learnerGroup)
  const dailyQuestion = getDailyQuestion(recommendedQuestions)
  const reviewPlan = planReview(recommendedQuestions, progress)
  const sessionSize = Math.min(recommendedQuestions.length, maxSessionLength)
  const dueInSession = Math.min(reviewPlan.due.length, Math.ceil(maxSessionLength * 0.6))
  const summary = summarizeProgress(progress)
  const masteryScore = calculateMasteryScore(progress, questions.length)
  const level = getLearnerLevel(masteryScore)
  const levelNumber = getLearnerLevelNumber(masteryScore)
  const streak = calculateStreak(progress)
  const studiedToday = hasStudiedToday(progress)
  const dueCount = reviewPlan.due.length
  const weakCount = weakQuestions(questions, progress).length
  const reviewedToday = countReviewedOn(progress)
  const { ref: categoryGridRef, isInView: isCategoryGridInView } = useInView<HTMLDivElement>()
  const briefing = dailyBriefing({
    nickname: profile.nickname,
    reviewedToday,
    goal: dailyReviewGoal,
    dueCount,
    streak,
  })
  const recommendedCategories = new Set(goal.recommendedCategories)
  const [isLevelGuideOpen, setIsLevelGuideOpen] = useState(false)

  function closeLevelGuide() {
    setIsLevelGuideOpen(false)
  }

  return (
    <main className="page home">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="brand-mark" aria-hidden="true">
            A!
          </span>
          <div>
            <strong>어텐션!</strong>
            <span>{profile.nickname}</span>
          </div>
        </div>
        <div className="app-header__actions">
          <button
            type="button"
            className="level-info-button"
            onClick={() => setIsLevelGuideOpen(true)}
            aria-haspopup="dialog"
            aria-label={`레벨 안내 열기, 현재 LV${levelNumber} ${level.label}`}
          >
            <span>LV{levelNumber}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 8.7v5M10 6.1v.2" />
            </svg>
          </button>
        </div>
      </header>

      <section className="home-hero home-enter" aria-labelledby="home-title">
        <div className="home-hero__glow" aria-hidden="true" />

        <div className="home-hero__copy">
          <span className="eyebrow">{briefing.greeting}</span>
          <h1 id="home-title" className="home-hero__headline" data-tone={briefing.tone}>
            {briefing.headline}
          </h1>
          <p>{briefing.detail}</p>

          <button
            type="button"
            className="button button--primary button--large home-hero__start"
            onClick={() => onStart('recommended')}
          >
            {dueCount > 0 ? `복습 ${dueCount}개 포함해 시작` : '바로 시작하기'}
            <span className="round-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <div
          className="home-hero__signal"
          role="status"
          aria-label={`설명력 점수 ${masteryScore}점, LV${levelNumber} ${level.label}`}
        >
          <StudyBuddy mood={streak > 0 ? 'celebrate' : 'calm'} size="medium" />
          <div className="home-hero__score">
            <span>
              <CountUpNumber value={masteryScore} />
              <small>/100</small>
            </span>
            <strong>
              LV{levelNumber} · {level.label}
            </strong>
          </div>
          <div className="signal-nodes" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      {isLevelGuideOpen ? <LevelGuideSheet score={masteryScore} onClose={closeLevelGuide} /> : null}

      <section className="today-card home-enter home-enter--today" aria-label="오늘의 상태">
        <div className="today-card__goal">
          <ProgressRing value={reviewedToday} goal={dailyReviewGoal} label="오늘의 목표" />
          <div>
            <span className="today-card__label">오늘의 목표</span>
            <strong>
              {reviewedToday >= dailyReviewGoal
                ? '오늘 몫 완료'
                : `${reviewedToday}/${dailyReviewGoal}개 확인`}
            </strong>
          </div>
        </div>

        <div
          className="streak-flame"
          data-lit={streak > 0}
          data-burst={streakJustGrew}
          role="img"
          aria-label={`연속 학습 ${streak}일${studiedToday ? '' : ', 오늘 아직'}`}
        >
          <span className="streak-flame__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 2.6c2.4 3.2 1.1 4.9.2 6.2-.8 1.2-.5 2.6.7 3 1.3.4 2.2-.6 2.2-2 1.9 1.7 2.9 3.6 2.9 5.6 0 3.7-3 6.6-6.7 6.6S4.6 19.1 4.6 15.4c0-4.6 4-6.6 5.2-9.6.5-1.2.6-2.3 2.2-3.2Z" />
            </svg>
          </span>
          <span className="streak-flame__count" aria-hidden="true">
            <CountUpNumber value={streak} durationMs={600} />
            <small>일</small>
          </span>
        </div>
      </section>

      {dailyQuestion === undefined ? null : (
        <button
          type="button"
          className="daily-challenge home-enter home-enter--daily"
          data-waiting={!studiedToday}
          onClick={() => onStartDaily(dailyQuestion)}
        >
          <div className="daily-challenge__meta">
            <span className="pill pill--lime">오늘의 10초 구술</span>
            <span>{categoryById[dailyQuestion.category].shortLabel}</span>
          </div>
          <strong>Q. {dailyQuestion.prompt}</strong>
          <div className="daily-challenge__footer">
            <span>바로 답해보기</span>
            <span className="round-arrow" aria-hidden="true">
              →
            </span>
          </div>
        </button>
      )}

      {weakCount > 0 ? (
        <button
          type="button"
          className="weak-callout home-enter home-enter--weak"
          onClick={() => onStart('weak')}
        >
          <span className="weak-callout__label">아직 못 말한 핵심 포인트</span>
          <strong>{weakCount}개 개념 다시 말해보기</strong>
          <span className="round-arrow" aria-hidden="true">
            →
          </span>
        </button>
      ) : null}

      <section className="home-section" aria-labelledby="goal-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">내 학습 방향</span>
            <h2 id="goal-title">추천 학습 순서</h2>
          </div>
          <span className="progress-mini">
            {summary.known}/{questions.length} 설명 가능
          </span>
        </div>

        <GoalSelector selectedGoal={profile.learningGoalId} onChange={onGoalChange} />

        <div className="recommendation-card">
          <div>
            <span>{goal.label} 추천 경로</span>
            <strong>{goal.recommendation}</strong>
          </div>
          <ol className="learning-path" aria-label="추천 카테고리">
            {goal.recommendedCategories.map((categoryId, index) => (
              <li key={categoryId}>
                {categoryById[categoryId].shortLabel}
                {index < goal.recommendedCategories.length - 1 ? <i aria-hidden="true">→</i> : null}
              </li>
            ))}
          </ol>
          {profile.goalNote.length > 0 ? <p>“{profile.goalNote}”</p> : null}
          <button
            type="button"
            className="button button--ink button--wide"
            onClick={() => onStart('recommended')}
          >
            {dueInSession > 0
              ? `복습 ${dueInSession}문제 포함해서 ${sessionSize}문제 시작`
              : `추천 ${sessionSize}문제 시작`}
          </button>
        </div>
      </section>

      <AdSlot enabled={adsEnabled} placement="learn-home-inline" provider={bannerAds} />

      <section className="home-section" aria-labelledby="category-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">직접 고르기</span>
            <h2 id="category-title">카테고리로 골라보기</h2>
          </div>
        </div>

        <button type="button" className="all-random-card" onClick={() => onStart('all')}>
          <span className="all-random-card__icon" aria-hidden="true">
            ↝
          </span>
          <span>
            <strong>전체 · 랜덤</strong>
            <small>{questions.length}개에서 순서 없이 꺼내기</small>
          </span>
          <span aria-hidden="true">→</span>
        </button>

        <div className="category-grid" ref={categoryGridRef} data-revealed={isCategoryGridInView}>
          {categories.map((category, index) => {
            const count = questions.filter((question) => question.category === category.id).length
            return (
              <button
                key={category.id}
                type="button"
                className="category-card"
                style={{ '--reveal-index': index } as CSSProperties}
                onClick={() => onStart(category.id)}
              >
                <span className="category-card__topline">
                  <span className="category-monogram">{category.shortLabel}</span>
                  {recommendedCategories.has(category.id) ? <small>추천</small> : null}
                </span>
                <strong>{category.label}</strong>
                <span>{count} questions</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
