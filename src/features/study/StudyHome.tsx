import { useState } from 'react'
import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import { type LearningGoalId, learningGoalById } from '../../domain/learning/goal'
import { type LearnerProfile, learnerGroupById } from '../../domain/learning/learner-profile'
import {
  calculateMasteryScore,
  calculateStreak,
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
import { StudyBuddy } from '../../shared/components/StudyBuddy'
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

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <span className="eyebrow">한 문제씩</span>
          <h1 id="home-title" className="sr-only">
            Can you explain it?
          </h1>
          <p className="home-hero__watermark" aria-hidden="true">
            Can you <br />
            explain it?
          </p>
          <p>
            답을 보기 전에 15초만 말해보세요.
            <br />
            막힌 부분만 다시 보면 돼요.
          </p>

          {/* 지금 들어와야 할 이유를 히어로에서 바로 보여준다. */}
          <div className="home-hero__today">
            {dueCount > 0 ? (
              <button
                type="button"
                className="due-chip due-chip--action"
                onClick={() => onStart('recommended')}
              >
                <span aria-hidden="true">●</span>
                복습할 개념 {dueCount}개
              </button>
            ) : (
              <span className="due-chip">밀린 복습 없음</span>
            )}
            {studiedToday ? (
              <span className="today-chip today-chip--done">오늘 완료</span>
            ) : (
              <span className="today-chip">오늘 아직</span>
            )}
          </div>
        </div>
        <div
          className="home-hero__signal"
          role="status"
          aria-label={`연속 학습 ${streak}일${studiedToday ? '' : ', 오늘 아직 학습 전'}`}
        >
          <StudyBuddy mood={streak > 0 ? 'celebrate' : 'calm'} size="medium" />
          <div className="home-hero__score">
            <span>
              {masteryScore}
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

      {dailyQuestion === undefined ? null : (
        <button
          type="button"
          className="daily-challenge"
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
        <button type="button" className="weak-callout" onClick={() => onStart('weak')}>
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

        <div className="category-grid">
          {categories.map((category) => {
            const count = questions.filter((question) => question.category === category.id).length
            return (
              <button
                key={category.id}
                type="button"
                className="category-card"
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
