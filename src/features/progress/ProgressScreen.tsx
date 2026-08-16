import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import { learningGoalById } from '../../domain/learning/goal'
import { type LearnerProfile, learnerGroupById } from '../../domain/learning/learner-profile'
import {
  calculateMasteryScore,
  calculateStreak,
  getLearnerLevel,
  type LearningProgress,
  summarizeProgress,
} from '../../domain/learning/progress'
import { categoryById, type StudyQuestion } from '../../domain/learning/question'
import { AppFooter } from '../../shared/components/AppFooter'
import { StudyBuddy } from '../../shared/components/StudyBuddy'
import { AdSlot } from '../monetization/AdSlot'

interface ProgressScreenProps {
  readonly profile: LearnerProfile
  readonly progress: LearningProgress
  readonly questions: readonly StudyQuestion[]
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onStudyQuestion: (question: StudyQuestion) => void
}

export function ProgressScreen({
  profile,
  progress,
  questions,
  adsEnabled,
  bannerAds,
  onStudyQuestion,
}: ProgressScreenProps) {
  const summary = summarizeProgress(progress)
  const streak = calculateStreak(progress)
  const masteryScore = calculateMasteryScore(progress, questions.length)
  const level = getLearnerLevel(masteryScore)
  const levelProgress =
    level.nextScore === null
      ? 100
      : Math.round(((masteryScore - level.minScore) / (level.nextScore - level.minScore)) * 100)
  const reviewCandidates = questions
    .filter((question) => {
      const rating = progress.questions[question.id]?.rating
      return rating === 'unknown' || rating === 'unsure'
    })
    .slice(0, 4)

  return (
    <main className="page progress-screen">
      <header className="page-header page-header--compact">
        <span className="eyebrow">{profile.nickname}</span>
        <h1 className="progress-screen__watermark">
          Find it. Unpack it.
          <br />
          Make it yours.
        </h1>
        <p>
          {learnerGroupById[profile.groupId].label} ·{' '}
          {learningGoalById[profile.learningGoalId].label}
        </p>
      </header>

      <section className="mastery-card" aria-label={`설명력 점수 ${masteryScore}점`}>
        <StudyBuddy mood={masteryScore >= 20 ? 'celebrate' : 'calm'} size="small" />
        <div className="mastery-card__score">
          <strong>{masteryScore}</strong>
          <span>/100</span>
        </div>
        <div>
          <span>{level.label}</span>
          <p>
            {level.nextScore === null
              ? '최고 레벨에 도착했어요'
              : `다음 레벨까지 ${level.nextScore - masteryScore}점`}
          </p>
        </div>
        <progress
          className="mastery-card__bar"
          max="100"
          value={levelProgress}
          aria-label={`현재 레벨 진행률 ${levelProgress}%`}
        />
      </section>
      <p className="score-caption">
        최근 자기평가로 계산한 학습 진도이며 시험·지능 점수가 아니에요.
      </p>

      <section className="stat-grid" aria-label="학습 통계">
        <div>
          <span>연속 학습</span>
          <strong>
            {streak}
            <small>일</small>
          </strong>
        </div>
        <div>
          <span>확인한 개념</span>
          <strong>
            {summary.reviewed}
            <small>개</small>
          </strong>
        </div>
        <div>
          <span>애매함</span>
          <strong>
            {summary.unsure}
            <small>개</small>
          </strong>
        </div>
        <div>
          <span>다시 보기</span>
          <strong>
            {summary.unknown}
            <small>개</small>
          </strong>
        </div>
      </section>

      <AdSlot enabled={adsEnabled} placement="progress-inline-banner" provider={bannerAds} />

      <section className="progress-section" aria-labelledby="review-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">REVIEW NEXT</span>
            <h2 id="review-title">다시 설명해볼 질문</h2>
          </div>
        </div>
        {reviewCandidates.length === 0 ? (
          <div className="empty-state empty-state--small">
            <h3>아직 복습 질문이 없어요.</h3>
            <p>답을 확인하고 이해도를 남기면 이곳에 모아드려요.</p>
          </div>
        ) : (
          <div className="review-list">
            {reviewCandidates.map((question) => (
              <button key={question.id} type="button" onClick={() => onStudyQuestion(question)}>
                <span>{categoryById[question.category].shortLabel}</span>
                <strong>{question.prompt}</strong>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        )}
      </section>

      <AppFooter />
    </main>
  )
}
