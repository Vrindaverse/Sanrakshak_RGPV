import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis
}

export function scrollToTarget(target: string | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.15 })
    return
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }

  const node = document.querySelector(target)
  node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
