import { useEffect, useState } from 'react'

export function useDeferredMount(enabled = true, timeout = 900) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let idleId: number | undefined
    let timer: number | undefined

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => setReady(true), { timeout })
    } else {
      timer = window.setTimeout(() => setReady(true), 220)
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [enabled, timeout])

  return ready
}
