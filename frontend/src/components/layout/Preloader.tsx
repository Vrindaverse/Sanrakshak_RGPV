import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { markIntroSeen } from '../../lib/intro'

const WORD = 'SANRAKSHAK'.split('')

type PreloaderProps = {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced) {
      markIntroSeen()
      onComplete()
      return
    }

    document.body.classList.add('is-locked')
    window.scrollTo(0, 0)

    const timer = window.setTimeout(() => setLeaving(true), 2350)
    return () => {
      window.clearTimeout(timer)
      document.body.classList.remove('is-locked')
    }
  }, [onComplete, reduced])

  useEffect(() => {
    if (!leaving) return
    markIntroSeen()
    document.body.classList.remove('is-locked')
    const timer = window.setTimeout(onComplete, 900)
    return () => window.clearTimeout(timer)
  }, [leaving, onComplete])

  if (reduced) return null

  return (
    <motion.div
      className="preloader"
      aria-label="Loading Sanrakshak"
      animate={leaving ? { opacity: 0, filter: 'blur(6px)' } : { opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <div className="preloader-inner">
        <motion.div
          className="preloader-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.25, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        />
        <div className="preloader-word" aria-hidden="true">
          {WORD.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.9 + index * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="preloader-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.55 }}
        >
          Protect. Analyze. Secure.
        </motion.p>
      </div>
      <button
        type="button"
        className="preloader-skip"
        onClick={() => setLeaving(true)}
      >
        Skip intro
      </button>
    </motion.div>
  )
}
