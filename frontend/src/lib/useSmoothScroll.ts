import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { setLenisInstance } from './scroll'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setLenisInstance(null)
      return
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
    })

    setLenisInstance(lenis)

    const onScroll = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)
    const refresh = () => ScrollTrigger.refresh()

    lenis.on('scroll', onScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.config({ ignoreMobileResize: true })

    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => undefined)

    return () => {
      window.removeEventListener('load', refresh)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [enabled])
}
