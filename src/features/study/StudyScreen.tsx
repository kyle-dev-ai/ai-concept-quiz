import { useState } from 'react'
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
  readonly onExit: () => void
  readonly onReveal: () => void
  readonly onRate: (rating: KnowledgeRating) => void
  readonly onNext: () => void
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
  onExit,
  onReveal,
  onRate,
  onNext,
  onShare,
}: StudyScreenProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [rating, setRating] = useState<KnowledgeRating | null>(null)
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)

  const progress = ((index + 1) / total) * 100

  function rate(nextRating: KnowledgeRating) {
    if (rating !== null) {
      return
    }
    setRating(nextRating)
    onRate(nextRating)
  }

  async function share() {
    const result = await onShare()
    setShareResult(result)
  }

  function reveal() {
    setIsRevealed(true)
    onReveal()
  }

  return (
    <main className="study-screen">
      <header className="study-header">
        <button type="button" className="icon-button" onClick={onExit} aria-label="학습 나가기">
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
      <div className="study-progress" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </div>

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
                  onClick={() => rate(option.id)}
                >
                  <span aria-hidden="true">{option.symbol}</span>
                  <strong>{option.label}</strong>
                  <small>{option.helper}</small>
                </button>
              ))}
            </div>
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
              <button type="button" className="button button--secondary" onClick={share}>
                친구에게 문제 내기
              </button>
              <button type="button" className="button button--primary" onClick={onNext}>
                {index + 1 === total ? '학습 마치기' : '다음 질문'}
              </button>
            </div>
            {shareResult === 'copied' ? (
              <small role="status">문제와 링크를 복사했어요.</small>
            ) : null}
            {shareResult === 'shared' ? <small role="status">공유 화면을 열었어요.</small> : null}
            {shareResult === 'unavailable' ? (
              <small role="status">이 환경에서는 아직 공유할 수 없어요.</small>
            ) : null}
          </div>
        )}
      </footer>
      <AdSlot enabled={adsEnabled} placement="study-bottom-banner" />
    </main>
  )
}
