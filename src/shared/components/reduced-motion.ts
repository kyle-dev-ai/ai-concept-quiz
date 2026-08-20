/** 사용자가 움직임 최소화를 켰는지. 켜져 있으면 연출을 건너뛰고 결과만 보여준다. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
