import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './reduced-motion'

interface CountUpNumberProps {
  readonly value: number
  /** 0에서 value까지 올라가는 데 걸리는 시간(ms). */
  readonly durationMs?: number
}

/** 끝에서 부드럽게 감속해 마지막 숫자가 또렷하게 멈춘다. */
function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 3
}

/**
 * 0에서 목표 숫자까지 굴러 올라가는 숫자.
 *
 * 홈에 들어설 때 그동안 쌓은 점수가 눈앞에서 채워지게 한다.
 * 움직임을 줄이도록 설정한 사용자에게는 곧바로 목표값을 보여준다.
 */
export function CountUpNumber({ value, durationMs = 900 }: CountUpNumberProps) {
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (value <= 0 || durationMs <= 0 || prefersReducedMotion()) {
      setShown(value)
      return
    }

    let frame = 0
    let startedAt: number | undefined
    setShown(0)

    function step(timestamp: number) {
      startedAt ??= timestamp
      const progress = Math.min(1, (timestamp - startedAt) / durationMs)
      setShown(Math.round(easeOut(progress) * value))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, value])

  return <>{shown}</>
}
