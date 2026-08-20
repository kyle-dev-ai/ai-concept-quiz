import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import type { ShareResult } from '../../application/ports/challenge-share'
import type { CountdownCue } from '../../application/ports/countdown-cue'
import type {
  SpeechFailure,
  SpeechRecognizer,
  SpeechSession,
} from '../../application/ports/speech-recognizer'
import type { KnowledgeRating, SpokenAttempt } from '../../domain/learning/progress'
import { categoryById, difficultyLabel, type StudyQuestion } from '../../domain/learning/question'
import { scoreSpokenAnswer, similarityBand } from '../../domain/learning/spoken-answer'
import { AdSlot } from '../monetization/AdSlot'

interface StudyScreenProps {
  readonly question: StudyQuestion
  readonly index: number
  readonly total: number
  readonly scopeLabel: string
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly speech: SpeechRecognizer
  readonly countdownCue: CountdownCue
  /** 답을 열기 전에 소리 내어 설명할 시간(초). 0이면 곧바로 열 수 있다. */
  readonly revealDelaySeconds?: number
  readonly onExit: () => void
  readonly onReveal: () => void
  /** 이 문항에서 지금까지 받은 최고 유사도. 기록 경신을 알릴 때 쓴다. */
  readonly bestSimilarity?: number
  readonly onRate: (rating: KnowledgeRating, attempt?: SpokenAttempt) => Promise<void>
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

const failureMessage: Record<SpeechFailure, string> = {
  unsupported: '이 브라우저는 음성 인식을 지원하지 않아요. 소리 내어 말한 뒤 직접 평가해주세요.',
  denied: '마이크 권한이 꺼져 있어요. 브라우저 설정에서 허용하면 말한 내용을 받아적어요.',
  'no-speech': '소리가 들리지 않았어요. 다시 시도하거나 그냥 말한 뒤 직접 평가해주세요.',
  error: '음성 인식을 시작하지 못했어요. 소리 내어 말한 뒤 직접 평가해주세요.',
}

/** 카운트다운이 시각·청각으로 급해지기 시작하는 지점(초). */
const urgentSeconds = 5

const bandMessage = {
  high: '모범 답과 표현이 많이 겹쳐요.',
  partial: '핵심은 닿았지만 빠진 표현이 있어요.',
  low: '모범 답과 표현이 많이 달라요. 놓친 부분을 확인해보세요.',
} as const

export function StudyScreen({
  question,
  index,
  total,
  scopeLabel,
  adsEnabled,
  bannerAds,
  speech,
  countdownCue,
  bestSimilarity = 0,
  revealDelaySeconds = 15,
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
  const [remainingSeconds, setRemainingSeconds] = useState(revealDelaySeconds)
  const [transcript, setTranscript] = useState('')
  const [speechFailure, setSpeechFailure] = useState<SpeechFailure | null>(null)
  const [isListening, setIsListening] = useState(false)
  const sessionRef = useRef<SpeechSession | null>(null)

  const progress = ((index + 1) / total) * 100
  const canReveal = remainingSeconds <= 0
  // 마지막 5초는 색이 짙어지고 맥박이 빨라진다.
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= urgentSeconds

  const stopListening = useCallback(() => {
    sessionRef.current?.stop()
    sessionRef.current = null
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    stopListening()
    setSpeechFailure(null)

    const session = speech.start({
      onTranscript: setTranscript,
      onFailure: (failure) => {
        setSpeechFailure(failure)
        setIsListening(false)
      },
    })
    sessionRef.current = session
    setIsListening(true)
  }, [speech, stopListening])

  // 문항마다 새로 마운트되므로(App에서 key={question.id}) 여기서 바로 듣기 시작한다.
  useEffect(() => {
    if (!speech.isSupported) {
      setSpeechFailure('unsupported')
      return
    }

    const session = speech.start({
      onTranscript: setTranscript,
      onFailure: (failure) => {
        setSpeechFailure(failure)
        setIsListening(false)
      },
    })
    sessionRef.current = session
    setIsListening(true)

    return () => {
      session.stop()
      sessionRef.current = null
    }
  }, [speech])

  // 마지막 초를 소리로 알린다. 뜨(4) 뜨(3) 뜨(2) 뜨(1) 뜬!(0)
  useEffect(() => {
    if (revealDelaySeconds <= 0 || isRevealed) {
      return
    }
    if (remainingSeconds === 0) {
      countdownCue.finish()
      return
    }
    if (remainingSeconds < urgentSeconds) {
      countdownCue.tick()
    }
  }, [countdownCue, isRevealed, remainingSeconds, revealDelaySeconds])

  // 남은 시간이 0이 될 때까지 1초씩 줄인다.
  // 0이 되면 isCountingDown이 false로 바뀌며 cleanup이 interval을 정리한다.
  const isCountingDown = remainingSeconds > 0
  useEffect(() => {
    if (!isCountingDown) {
      return
    }

    const timer = setInterval(
      () => setRemainingSeconds((seconds) => (seconds <= 1 ? 0 : seconds - 1)),
      1000,
    )
    return () => clearInterval(timer)
  }, [isCountingDown])

  const spokenScore = transcript.trim().length > 0 ? scoreSpokenAnswer(transcript, question) : null
  const isPersonalBest = spokenScore !== null && spokenScore.similarity > bestSimilarity

  async function rate(nextRating: KnowledgeRating) {
    if (rating !== null || isSavingRating) {
      return
    }

    setIsSavingRating(true)
    setPendingRating(nextRating)
    setRatingError(false)
    try {
      await onRate(
        nextRating,
        spokenScore === null
          ? undefined
          : {
              similarity: spokenScore.similarity,
              missedKeyPoints: spokenScore.coverage
                .filter((entry) => !entry.covered)
                .map((entry) => entry.keyPoint),
            },
      )
      setRating(nextRating)
    } catch {
      setRatingError(true)
    } finally {
      setPendingRating(null)
      setIsSavingRating(false)
    }
  }

  function reveal() {
    stopListening()
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
            {spokenScore !== null ? (
              <div className="spoken-score" data-band={similarityBand(spokenScore.similarity)}>
                <div className="spoken-score__headline">
                  <span className="spoken-score__label">말한 답과 모범 답 유사도</span>
                  <strong className="spoken-score__value">
                    {spokenScore.similarity}
                    <small>%</small>
                  </strong>
                </div>
                {isPersonalBest && bestSimilarity > 0 ? (
                  <p className="spoken-score__record">
                    <span aria-hidden="true">★</span>
                    최고 기록 경신! 지난 기록 {bestSimilarity}%
                  </p>
                ) : null}

                <p className="spoken-score__message">
                  {bandMessage[similarityBand(spokenScore.similarity)]}
                </p>

                <ul className="spoken-score__coverage">
                  {spokenScore.coverage.map((entry) => (
                    <li key={entry.keyPoint} data-covered={entry.covered}>
                      <span aria-hidden="true">{entry.covered ? '●' : '○'}</span>
                      <span>{entry.keyPoint}</span>
                      <small>{entry.covered ? '말했음' : '못 말했음'}</small>
                    </li>
                  ))}
                </ul>

                <details className="spoken-score__transcript">
                  <summary>내가 말한 내용 보기</summary>
                  <p>{transcript}</p>
                </details>

                <small className="spoken-score__caveat">
                  표현이 겹치는 정도만 재는 참고값이에요. 뜻이 같아도 낱말이 다르면 낮게 나와요.
                </small>
              </div>
            ) : null}

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

            {isListening ? (
              <div className="mic-status" role="status">
                <span className="mic-status__dot" aria-hidden="true" />
                <span>듣는 중</span>
              </div>
            ) : null}

            {transcript.length > 0 ? (
              <p className="live-transcript" aria-live="polite">
                {transcript}
              </p>
            ) : null}

            {speechFailure !== null ? (
              <div className="mic-failure">
                <small>{failureMessage[speechFailure]}</small>
                {speechFailure !== 'unsupported' ? (
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={startListening}
                  >
                    다시 시도
                  </button>
                ) : null}
              </div>
            ) : null}

            <small>완벽한 문장보다 핵심 흐름이 먼저예요.</small>
            {speech.isSupported ? (
              <small className="mic-privacy">
                음성 인식은 브라우저 기능이라 브라우저에 따라 외부 서버를 거칠 수 있어요. 받아적은
                내용은 저장하지 않아요.
              </small>
            ) : null}
          </div>
        )}
      </article>

      <footer className="study-actions">
        {!isRevealed ? (
          <button
            type="button"
            className="button button--primary button--large button--wide button--countdown"
            disabled={!canReveal}
            data-urgency={isUrgent ? remainingSeconds : undefined}
            style={
              isUrgent
                ? ({ '--countdown-pulse': `${260 + remainingSeconds * 130}ms` } as CSSProperties)
                : undefined
            }
            onClick={reveal}
          >
            {canReveal ? '답 확인하기' : `${remainingSeconds}초 뒤에 답을 볼 수 있어요`}
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
