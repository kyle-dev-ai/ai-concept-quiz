import { useEffect, useRef } from 'react'
import {
  getLearnerLevel,
  getLearnerLevelNumber,
  learnerLevels,
} from '../../domain/learning/progress'

interface LevelGuideSheetProps {
  readonly score: number
  readonly onClose: () => void
}

function scoreRange(minScore: number, nextScore: number | null): string {
  return nextScore === null ? `${minScore}–100점` : `${minScore}–${nextScore - 1}점`
}

export function LevelGuideSheet({ score, onClose }: LevelGuideSheetProps) {
  const currentLevel = getLearnerLevel(score)
  const currentLevelNumber = getLearnerLevelNumber(score)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const wasScrollLocked = document.body.classList.contains('modal-scroll-lock')
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.classList.add('modal-scroll-lock')

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') {
        return
      }

      const focusable = [
        ...(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []),
      ].filter((element) => !element.disabled && element.tabIndex >= 0)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (first === undefined || last === undefined) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      if (!wasScrollLocked) {
        document.body.classList.remove('modal-scroll-lock')
      }
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className="level-guide-backdrop">
      <section
        ref={dialogRef}
        className="level-guide-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-guide-title"
      >
        <div className="level-guide-sheet__handle" aria-hidden="true" />
        <header className="level-guide-sheet__header">
          <div>
            <span className="eyebrow">지금 {score}/100</span>
            <h2 id="level-guide-title">Your level map</h2>
            <p>현재 질문 덱에서 내 말로 설명할 수 있는 개념이 늘면 올라가요.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="레벨 안내 닫기"
          >
            ×
          </button>
        </header>

        <ol className="level-list">
          {learnerLevels.map((level, index) => {
            const isCurrent = level.id === currentLevel.id
            return (
              <li key={level.id} data-current={isCurrent}>
                <span>LV{index + 1}</span>
                <div>
                  <strong>{level.label}</strong>
                  <small>{scoreRange(level.minScore, level.nextScore)}</small>
                </div>
                {isCurrent ? <em>현재</em> : null}
              </li>
            )
          })}
        </ol>

        <div className="level-guide-sheet__calculation">
          <strong>점수 계산</strong>
          <p>각 질문의 최근 기록을 기준으로 알았다 1 · 애매했다 0.5 · 몰랐다 0</p>
        </div>

        <button type="button" className="button button--primary button--wide" onClick={onClose}>
          LV{currentLevelNumber}에서 계속하기
        </button>
      </section>
      <button
        type="button"
        className="level-guide-dismiss"
        onClick={onClose}
        tabIndex={-1}
        aria-label="바깥 영역 눌러 레벨 안내 닫기"
      />
    </div>
  )
}
