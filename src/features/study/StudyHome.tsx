import { useState } from 'react'
import { type LearningGoalId, learningGoalById } from '../../domain/learning/goal'
import { type LearnerProfile, learnerGroupById } from '../../domain/learning/learner-profile'
import {
  calculateMasteryScore,
  calculateStreak,
  getLearnerLevel,
  getLearnerLevelNumber,
  type LearningProgress,
  summarizeProgress,
} from '../../domain/learning/progress'
import {
  categories,
  categoryById,
  type StudyQuestion,
  type StudyScope,
} from '../../domain/learning/question'
import { getDailyQuestion, questionsForScope } from '../../domain/learning/session'
import { StudyBuddy } from '../../shared/components/StudyBuddy'
import { GoalSelector } from '../goal-selector/GoalSelector'
import { AdSlot } from '../monetization/AdSlot'
import { LevelGuideSheet } from '../progress/LevelGuideSheet'

interface StudyHomeProps {
  readonly questions: readonly StudyQuestion[]
  readonly profile: LearnerProfile
  readonly progress: LearningProgress
  readonly adsEnabled: boolean
  readonly onGoalChange: (goalId: LearningGoalId) => void
  readonly onStart: (scope: StudyScope) => void
  readonly onStartDaily: (question: StudyQuestion) => void
  readonly onOpenProfile: () => void
}

export function StudyHome({
  questions,
  profile,
  progress,
  adsEnabled,
  onGoalChange,
  onStart,
  onStartDaily,
  onOpenProfile,
}: StudyHomeProps) {
  const goal = learningGoalById[profile.learningGoalId]
  const learnerGroup = learnerGroupById[profile.groupId]
  const recommendedQuestions = questionsForScope(questions, 'recommended', goal, learnerGroup)
  const dailyQuestion = getDailyQuestion(recommendedQuestions)
  const summary = summarizeProgress(progress)
  const masteryScore = calculateMasteryScore(progress, questions.length)
  const level = getLearnerLevel(masteryScore)
  const levelNumber = getLearnerLevelNumber(masteryScore)
  const streak = calculateStreak(progress)
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
          <button type="button" className="profile-button" onClick={onOpenProfile}>
            <span aria-hidden="true">{profile.nickname.slice(-1)}</span>
            <span className="sr-only">학습 설정 열기</span>
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
            답을 보기 전에 10초만 말해보세요.
            <br />
            막힌 부분만 다시 보면 돼요.
          </p>
        </div>
        <div className="home-hero__signal" role="status" aria-label={`연속 학습 ${streak}일`}>
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
            추천 {recommendedQuestions.length}문제 시작
          </button>
        </div>
      </section>

      <AdSlot enabled={adsEnabled} placement="learn-home-inline" />

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
