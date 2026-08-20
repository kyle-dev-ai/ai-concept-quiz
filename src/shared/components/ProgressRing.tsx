import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './reduced-motion'

interface ProgressRingProps {
  readonly value: number
  readonly goal: number
  readonly label: string
}

const radius = 26
const circumference = 2 * Math.PI * radius

/**
 * 오늘 미션이 얼마나 찼는지 보여주는 원형 게이지.
 * 목표를 넘겨도 링은 가득 찬 상태에서 멈추고 숫자만 늘어난다.
 */
export function ProgressRing({ value, goal, label }: ProgressRingProps) {
  const ratio = goal <= 0 ? 0 : Math.min(1, value / goal)
  const isComplete = value >= goal
  // 완성된 링이 그냥 나타나면 오늘 채운 것이 눈에 남지 않는다. 빈 링에서 차오르게 한다.
  const [drawn, setDrawn] = useState(prefersReducedMotion() ? ratio : 0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDrawn(ratio)
      return
    }

    const frame = requestAnimationFrame(() => setDrawn(ratio))
    return () => cancelAnimationFrame(frame)
  }, [ratio])

  return (
    <div
      className="progress-ring"
      data-complete={isComplete}
      role="img"
      aria-label={`${label} ${goal}개 중 ${value}개`}
    >
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="progress-ring__track" cx="32" cy="32" r={radius} />
        <circle
          className="progress-ring__value"
          cx="32"
          cy="32"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - drawn)}
        />
      </svg>
      <span className="progress-ring__count" aria-hidden="true">
        {isComplete ? '✓' : value}
      </span>
    </div>
  )
}
