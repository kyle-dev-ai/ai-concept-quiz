import { useState } from 'react'
import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import type { ShareResult } from '../../application/ports/challenge-share'
import type { KnowledgeRating } from '../../domain/learning/progress'
import { categoryById, difficultyLabel, type StudyQuestion } from '../../domain/learning/question'
import { AdSlot } from '../monetization/AdSlot'

interface StudyScreenProps {
  readonly question: StudyQuestion
  readonly index: number
  readonly total: number
  readonly scopeLabel: string
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onExit: () => void
  readonly onReveal: () => void
  readonly onRate: (rating: KnowledgeRating) => Promise<void>
  readonly onNext: () => void
  // 공유 링크 목적지가 없어(토스 WebView 내부 URL) 화면에서는 비활성화 상태다.
  // standalone HTTPS 주소가 생기면 아래 주석 처리된 공유 UI와 함께 되살린다.
  readonly onShare: () => Promise<ShareResult>
}

const ratingOptions: readonly {
  id: KnowledgeRating
  label: string
  helper: string
  symbol: string
}[] = [
  { id: 'unknown', label: '몰랐다', helper: '처음부터 다시', symbol: '○' },
  { id: 'unsure', label: '애매했다', helper: '한 번 더 보기', symbol: '◐' },
  { id: 'known', label: '알았다', helper: '설명할 수 있음', symbol: '●' },
]

export function StudyScreen({
  question,
  index,
  total,
  scopeLabel,
  adsEnabled,
  bannerAds,
  onExit,
  onReveal,
  onRate,
  onNext,
}: StudyScreenProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [rating, setRating] = useState<KnowledgeRating | null>(null)
  const [pendingRating, setPendingRating] = useState<KnowledgeRating | null>(null)
  const [isSavingRating, setIsSavingRating] = useState(false)
  const [ratingError, setRatingError] = useState(false)

  const progress = ((index + 1) / total) * 100

  async function rate(nextRating: KnowledgeRating) {
    if (rating !== null || isSavingRating) {
      return
    }

    setIsSavingRating(true)
    setPendingRating(nextRating)
    setRatingError(false)
    try {
      await onRate(nextRating)
      setRating(nextRating)
    } catch {
      setRatingError(true)
    } finally {
      setPendingRating(null)
      setIsSavingRating(false)
    }
  }

  function reveal() {
    setIsRevealed(true)
    onReveal()
  }

  return (
    <main className="study-screen">
      <header className="study-header">
        <button
          type="button"
          className="icon-button"
          disabled={isSavingRating}
          onClick={onExit}
          aria-label="학습 나가기"
        >
          ×
        </button>
        <div className="study-header__center">
          <span>{scopeLabel}</span>
          <strong>
            {index + 1} / {total}
          </strong>
        </div>
        <span className="study-header__spacer" aria-hidden="true" />
      </header>
      <progress
        className="study-progress"
        max="100"
        value={progress}
        aria-label={`학습 진행률 ${Math.round(progress)}%`}
      />

      <article className="question-card" data-revealed={isRevealed}>
        <div className="question-card__meta">
          <div>
            <span className="pill">{categoryById[question.category].shortLabel}</span>
            <span>{difficultyLabel[question.difficulty]}</span>
          </div>
          <div className="concept-signal" data-active={isRevealed} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="question-card__body">
          <span className="question-number">QUESTION {String(index + 1).padStart(2, '0')}</span>
          <h1>{question.prompt}</h1>
          <code>{question.term}</code>
        </div>

        {isRevealed ? (
          <section className="answer-panel" aria-live="polite">
            <span className="answer-panel__label">10초 핵심 답변</span>
            <p className="answer-panel__short">{question.shortAnswer}</p>

            <ul className="key-points">
              {question.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <details className="deep-answer">
              <summary>대학원·면접 수준으로 더 보기</summary>
              <p>{question.deepAnswer}</p>
            </details>

            <div className="follow-up">
              <span>교수님의 꼬리질문</span>
              <p>{question.followUp}</p>
            </div>
          </section>
        ) : (
          <div className="thinking-space">
            <div className="thinking-space__line" aria-hidden="true" />
            <p>
              화면을 잠깐 내려놓고
              <br />
              소리 내어 설명해보세요.
            </p>
            <small>완벽한 문장보다 핵심 흐름이 먼저예요.</small>
          </div>
        )}
      </article>

      <footer className="study-actions">
        {!isRevealed ? (
          <button
            type="button"
            className="button button--primary button--large button--wide"
            onClick={reveal}
          >
            답 확인하기
          </button>
        ) : rating === null ? (
          <div className="rating-panel">
            <span>답 보기 전, 어디까지 설명했나요?</span>
            <div className="rating-grid">
              {ratingOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`rating-button rating-button--${option.id}`}
                  data-pending={pendingRating === option.id}
                  data-dimmed={pendingRating !== null && pendingRating !== option.id}
                  disabled={isSavingRating}
                  onClick={() => void rate(option.id)}
                >
                  <span aria-hidden="true">{option.symbol}</span>
                  <strong>{option.label}</strong>
                  <small>{option.helper}</small>
                </button>
              ))}
            </div>
            {isSavingRating ? <small role="status">기록하는 중…</small> : null}
            {ratingError ? (
              <small className="rating-panel__error" role="alert">
                기록하지 못했어요. 다시 눌러주세요.
              </small>
            ) : null}
          </div>
        ) : (
          <div className="post-rating-actions">
            <div className="post-rating-actions__message">
              <span className="pill pill--lime">기록 완료</span>
              <p>
                {rating === 'known' ? '내 말로 설명한 개념이에요.' : '다음 복습에서 다시 만나요.'}
              </p>
            </div>
            <div className="post-rating-actions__buttons">
              {/* 친구에게 문제 내기: 공유 링크가 받는 사람이 열 수 없는 WebView 내부 URL이라
                  standalone HTTPS 배포 전까지 숨긴다. 되살릴 때는 onShare를 다시 destructure하고
                  shareResult state, share() 핸들러, 아래 결과 메시지를 함께 복구한다.
              <button type="button" className="button button--secondary" onClick={share}>
                친구에게 문제 내기
              </button>
              */}
              <button type="button" className="button button--primary" onClick={onNext}>
                {index + 1 === total ? '학습 마치기' : '다음 질문'}
              </button>
            </div>
            {/* 공유 결과 메시지 (공유 버튼과 함께 복구)
            {shareResult === 'copied' ? (
              <small role="status">문제와 링크를 복사했어요.</small>
            ) : null}
            {shareResult === 'shared' ? <small role="status">공유 화면을 열었어요.</small> : null}
            {shareResult === 'unavailable' ? (
              <small role="status">이 환경에서는 아직 공유할 수 없어요.</small>
            ) : null}
            */}
          </div>
        )}
      </footer>
      <AdSlot enabled={adsEnabled} placement="study-bottom-banner" provider={bannerAds} />
    </main>
  )
}
