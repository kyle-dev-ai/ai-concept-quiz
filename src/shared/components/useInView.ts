import { useEffect, useRef, useState } from 'react'

/**
 * 요소가 화면에 들어왔는지 알려준다. 한 번 보이면 그 뒤로는 계속 true다.
 *
 * IntersectionObserver가 없는 환경에서는 곧바로 true를 돌려준다.
 * 등장 연출은 거들기만 하는 요소라, 관찰할 수 없다고 내용이 안 보이면 안 된다.
 */
export function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (isInView || node === null || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isInView])

  return { ref, isInView }
}
