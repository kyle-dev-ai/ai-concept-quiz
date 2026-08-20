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
  adsEnabled,
  bannerAds,
  onRestart,
  onHome,
}: StudyCompleteProps) {
  const pointsToNextLevel =
    level.nextScore === null ? null : Math.max(0, level.nextScore - masteryScore)

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

      <p>많이 넘긴 날보다, 하나를 설명한 날이 더 오래 남아요.</p>

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
