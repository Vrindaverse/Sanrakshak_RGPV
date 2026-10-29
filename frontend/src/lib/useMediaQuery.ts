import { useEffect, useState } from 'react'

export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return fallback
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
