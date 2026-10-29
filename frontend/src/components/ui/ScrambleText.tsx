import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________'

type ScrambleTextProps = {
  text: string
  className?: string
  duration?: number
}

export function ScrambleText({ text, className = '', duration = 900 }: ScrambleTextProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(reduced ? text : '')
  const started = useRef(false)

  useEffect(() => {
    if (reduced) {
      setDisplay(text)
      return
    }

    const node = ref.current
    if (!node) return

    started.current = false
    setDisplay('')

    let frame = 0
    let animation = 0
    let startTime = 0

    function run(now: number) {
      if (!startTime) startTime = now
      const progress = Math.min(1, (now - startTime) / duration)
      const reveal = Math.floor(progress * text.length)

      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < reveal) return char
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join(''),
      )

      if (progress < 1) {
        frame = requestAnimationFrame(run)
      } else {
        setDisplay(text)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        animation = requestAnimationFrame(run)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(animation)
    }
  }, [text, duration, reduced])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || text}</span>
    </span>
  )
}
