import { lazy, Suspense, useState, type FormEvent } from 'react'
import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWebGLSupport } from '../../lib/useWebGLSupport'
import { useDeferredMount } from '../../lib/useDeferredMount'
import { scrollToTarget } from '../../lib/scroll'
import { GuardianFallback } from '../three/GuardianFallback'
import { ArrowDown, ArrowUpRight } from '../ui/icons'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

function normalizeSite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (!url.hostname.includes('.') || url.hostname.length < 4) return null
    return url.toString()
  } catch {
    return null
  }
}

export function Hero() {
  const navigate = useNavigate()
  const reduced = useFramerReducedMotion()
  const webgl = useWebGLSupport()
  const show3D = useDeferredMount(webgl && !reduced, 850)
  const [site, setSite] = useState('')
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = normalizeSite(site)
    if (!normalized) {
      setError('Enter a website address, like example.com.')
      return
    }
    setError('')
    navigate(`/register?site=${encodeURIComponent(normalized)}`)
  }

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <GuardianFallback />
      {webgl && show3D && (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      )}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-side" aria-hidden="true">
        Scan / Analyse / Explain / Secure
      </div>

      <div className="shell hero-inner">
        <div className="hero-meta">
          <span>AI-assisted website security</span>
          <span>Nmap · Nikto · OWASP ZAP</span>
        </div>

        <div className="hero-copy">
          <motion.p
            className="hero-kicker"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Protect. Analyze. Secure.
          </motion.p>

          <h1 className="hero-title" id="hero-title">
            <span className="hero-title-line">
              <motion.span
                initial={reduced ? false : { y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                Your website,
              </motion.span>
            </span>
            <span className="hero-title-line">
              <motion.span
                initial={reduced ? false : { y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.05, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <em>guarded.</em>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-sub"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            Scan. Understand. Fix. Security in plain language.
          </motion.p>

          <motion.div
            className="hero-form"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}
          >
            <form className="scan-form" onSubmit={onSubmit} noValidate>
              <label className="sr-only" htmlFor="hero-url">
                Website address
              </label>
              <input
                id="hero-url"
                name="site"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="https://your-site.com"
                value={site}
                onChange={(event) => {
                  setSite(event.target.value)
                  if (error) setError('')
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'hero-site-error' : 'hero-site-note'}
              />
              <button type="submit" className="btn btn-primary">
                Scan your site
                <ArrowUpRight />
              </button>
            </form>

            {error && (
              <p className="scan-error" id="hero-site-error" role="alert">
                {error}
              </p>
            )}

            <div className="hero-actions">
              <button
                type="button"
                className="link-underline"
                onClick={() => scrollToTarget('#how-it-works')}
              >
                <span>See how it works</span>
                <ArrowDown />
              </button>
              <span className="hero-note" id="hero-site-note">
                Sample data only. No live scan runs on this page.
              </span>
            </div>
          </motion.div>
        </div>

        <div className="hero-foot">
          <span className="scroll-cue">
            <i className="scroll-cue-line" aria-hidden="true" />
            <span>Scroll to begin</span>
          </span>
          <span>01 / 10</span>
        </div>
      </div>
    </section>
  )
}
