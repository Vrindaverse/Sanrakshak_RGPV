import { useEffect, useRef, useState } from 'react'

export function useCanvasActive<T extends HTMLElement>(rootMargin = '160px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(
    typeof document === 'undefined' ? true : !document.hidden,
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const onVisibility = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return { ref, active: inView && documentVisible }
}
