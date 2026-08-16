import { StudyBuddy } from '../../shared/components/StudyBuddy'
import type { AdPlacement } from '../monetization/AdSlot'
import { AdSlot } from '../monetization/AdSlot'

interface StudyCompleteProps {
  readonly reviewedCount: number
  readonly adsEnabled: boolean
  readonly onRestart: () => void
  readonly onHome: () => void
}

const completionPlacement: AdPlacement = 'session-complete'

export function StudyComplete({
  reviewedCount,
  adsEnabled,
  onRestart,
  onHome,
}: StudyCompleteProps) {
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
      <p>많이 넘긴 날보다, 하나를 설명한 날이 더 오래 남아요.</p>

      <AdSlot enabled={adsEnabled} placement={completionPlacement} />

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
