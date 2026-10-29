import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../lib/useInView'
import { useReducedMotion } from '../../lib/useReducedMotion'

type CounterProps = {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

export function Counter({ value, suffix = '', duration = 1500, className = '' }: CounterProps) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>()
  const [display, setDisplay] = useState(reduced ? value : 0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    const start = performance.now()

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration)
      setDisplay(Math.round(easeOutCubic(progress) * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  )
}
