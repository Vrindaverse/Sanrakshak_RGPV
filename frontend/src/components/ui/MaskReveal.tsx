import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type MaskRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function MaskReveal({ children, className = '', delay = 0 }: MaskRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <span className={`mask-reveal ${className}`.trim()}>{children}</span>
  }

  return (
    <span className={`mask-reveal ${className}`.trim()}>
      <motion.span
        initial={{ y: '115%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}
