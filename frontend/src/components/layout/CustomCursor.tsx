import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { useReducedMotion } from '../../lib/useReducedMotion'

export function CustomCursor() {
  const finePointer = useMediaQuery('(pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.35 })
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.35 })
  const [mode, setMode] = useState<'default' | 'hover' | 'text'>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setMode('text')
        return
      }
      if (target.closest('a, button, [data-cursor="hover"]')) {
        setMode('hover')
        return
      }
      setMode('default')
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerenter', onEnter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerenter', onEnter)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div className="cursor-layer" data-mode={mode} data-visible={visible ? 'true' : 'false'} aria-hidden="true">
      <motion.div className="cursor-ring" style={{ x: ringX, y: ringY }} />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </div>
  )
}
