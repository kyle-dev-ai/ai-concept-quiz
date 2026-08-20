import { useEffect, useRef } from 'react'
import type { LearnerLevel } from '../../domain/learning/progress'

interface LevelUpCelebrationProps {
  readonly levelNumber: number
  readonly level: LearnerLevel
  readonly onClose: () => void
}

// 화면을 가로지르는 조각들. 위치와 색이 고정이라 매번 같은 모양으로 터진다.
const confettiPieces = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
] as const

/**
 * 레벨이 오른 순간 화면을 덮는 축하.
 *
 * 점수가 조용히 1점 오르는 것과 레벨이 바뀌는 것은 무게가 다르다.
 * 레벨이 바뀔 때만 띄우고, 확인을 누르면 다시 뜨지 않는다.
 */
export function LevelUpCelebration({ levelNumber, level, onClose }: LevelUpCelebrationProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="level-up" role="dialog" aria-modal="true" aria-labelledby="level-up-title">
      <div className="level-up__confetti" aria-hidden="true">
        {confettiPieces.map((piece, index) => (
          <i
            key={piece}
            style={{
              left: `${(index * 100) / confettiPieces.length + 3}%`,
              animationDelay: `${(index % 5) * 90}ms`,
            }}
          />
        ))}
      </div>

      <div className="level-up__card">
        <span className="eyebrow">LEVEL UP</span>
        <strong className="level-up__badge">LV{levelNumber}</strong>
        <h2 id="level-up-title">{level.label}</h2>
        <p>내 말로 설명한 개념이 쌓여 다음 단계에 올라섰어요.</p>
        <button
          ref={closeButtonRef}
          type="button"
          className="button button--primary button--wide"
          onClick={onClose}
        >
          계속하기
        </button>
      </div>
    </div>
  )
}
