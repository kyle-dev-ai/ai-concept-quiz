import type { AdPlacement, BannerAdProvider } from '../../application/ports/banner-ad-provider'
import type { LearnerLevel } from '../../domain/learning/progress'
import { StudyBuddy } from '../../shared/components/StudyBuddy'
import { AdSlot } from '../monetization/AdSlot'

interface StudyCompleteProps {
  readonly reviewedCount: number
  readonly streak: number
  readonly masteryScore: number
  readonly level: LearnerLevel
  /** 내일 복습할 때가 되는 문항 수. */
  readonly dueTomorrow: number
  /** 이번 세션에서 기록된 발화 유사도. 음성 인식을 쓴 문항만 담긴다. */
  readonly similarities: readonly number[]
  /** 이번 세션에서 개인 최고 유사도를 넘긴 횟수. */
  readonly recordsBroken: number
  /** 아직 말하지 못한 핵심 포인트가 남은 문항 수. */
  readonly weakCount: number
  readonly onStartWeak: () => void
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onRestart: () => void
  readonly onHome: () => void
}

const completionPlacement: AdPlacement = 'session-complete'

export function StudyComplete({
  reviewedCount,
  streak,
  masteryScore,
  level,
  dueTomorrow,
  similarities,
  recordsBroken,
  weakCount,
  onStartWeak,
  adsEnabled,
  bannerAds,
  onRestart,
  onHome,
}: StudyCompleteProps) {
  const pointsToNextLevel =
    level.nextScore === null ? null : Math.max(0, level.nextScore - masteryScore)
  const averageSimilarity =
    similarities.length === 0
      ? null
      : Math.round(similarities.reduce((total, value) => total + value, 0) / similarities.length)

  return (
    <main className="study-complete">
      <StudyBuddy mood="celebrate" size="large" />
      <div className="completion-signal" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="eyebrow">오늘의 연결 완료</span>
      <h1>
        {reviewedCount}개 개념을
        <br />내 말로 확인했어요.
      </h1>

      {streak > 0 ? (
        <div className="completion-stats">
          <section className="completion-stat" aria-label={`연속 학습 ${streak}일`}>
            <strong>
              {streak}
              <small>일</small>
            </strong>
            <span>연속 학습</span>
          </section>
          <section className="completion-stat" aria-label={`설명력 점수 ${masteryScore}점`}>
            <strong>
              {masteryScore}
              <small>점</small>
            </strong>
            <span>
              {pointsToNextLevel === null ? level.label : `다음 레벨까지 ${pointsToNextLevel}점`}
            </span>
          </section>
        </div>
      ) : null}

      {averageSimilarity === null ? null : (
        <section className="spoken-summary" aria-label={`오늘 평균 유사도 ${averageSimilarity}%`}>
          <div className="spoken-summary__row">
            <span>말한 답 평균 유사도</span>
            <strong>{averageSimilarity}%</strong>
          </div>
          {recordsBroken > 0 ? (
            <p className="note-badge">
              <span aria-hidden="true">★</span>
              개인 최고 기록 {recordsBroken}개 경신
            </p>
          ) : null}
        </section>
      )}

      <p>많이 넘긴 날보다, 하나를 설명한 날이 더 오래 남아요.</p>

      {weakCount > 0 ? (
        <button type="button" className="weak-callout" onClick={onStartWeak}>
          <span className="weak-callout__label">아직 못 말한 핵심 포인트</span>
          <strong>{weakCount}개 개념 다시 말해보기</strong>
          <span className="round-arrow" aria-hidden="true">
            →
          </span>
        </button>
      ) : null}

      {/* 세션 직후가 다시 올 이유를 알려주기 가장 좋은 순간이다. */}
      <div className="next-review" role="status">
        {dueTomorrow > 0 ? (
          <>
            <span className="next-review__label">내일 복습할 개념</span>
            <strong>{dueTomorrow}개</strong>
          </>
        ) : (
          <>
            <span className="next-review__label">다음 복습</span>
            <strong>아직 예정 없음</strong>
          </>
        )}
      </div>

      <AdSlot enabled={adsEnabled} placement={completionPlacement} provider={bannerAds} />

      <div className="study-complete__actions">
        <button type="button" className="button button--primary button--large" onClick={onRestart}>
          같은 범위 다시 섞기
        </button>
        <button type="button" className="text-button" onClick={onHome}>
          홈으로
        </button>
      </div>
    </main>
  )
}
