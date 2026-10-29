import { useRef, type PointerEvent, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion as useFramerReducedMotion,
} from 'framer-motion'
import { useMediaQuery } from '../../lib/useMediaQuery'

type TiltCardProps = {
  children: ReactNode
  className?: string
  maxTilt?: number
  'data-size'?: string
  'data-tall'?: string
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 5,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useFramerReducedMotion()
  const coarse = useMediaQuery('(pointer: coarse)')
  const disabled = reduced || coarse

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-1, 1], [maxTilt, -maxTilt]), {
    stiffness: 160,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(px, [-1, 1], [-maxTilt, maxTilt]), {
    stiffness: 160,
    damping: 20,
  })

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width
    const ny = (event.clientY - rect.top) / rect.height
    px.set(nx * 2 - 1)
    py.set(ny * 2 - 1)
    node.style.setProperty('--mx', `${nx * 100}%`)
    node.style.setProperty('--my', `${ny * 100}%`)
  }

  function onPointerLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`feature-card ${className}`.trim()}
      style={
        disabled
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1200 }
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
