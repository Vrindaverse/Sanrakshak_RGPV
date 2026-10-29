import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion as useFramerReducedMotion, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../lib/useMediaQuery'

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className = '', strength = 0.24 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useFramerReducedMotion()
  const coarse = useMediaQuery('(pointer: coarse)')
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.25 })
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.25 })

  const disabled = reduced || coarse

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  function onPointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`.trim()}
      style={disabled ? undefined : { x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  )
}
