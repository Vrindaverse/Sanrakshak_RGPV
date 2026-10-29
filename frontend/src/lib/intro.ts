export const INTRO_KEY = 'sanrakshak:intro-seen'

export function hasSeenIntro() {
  if (typeof window === 'undefined') return true
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    // Storage can be unavailable in private modes; the intro is still safe to skip.
  }
}
