import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { navLinks } from '../../content/site'
import { scrollToTarget } from '../../lib/scroll'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Wordmark } from './Wordmark'
import { ArrowUpRight } from '../ui/icons'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!menuOpen) return
    document.body.classList.add('is-locked')
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function goTo(target: string) {
    setMenuOpen(false)
    window.setTimeout(() => scrollToTarget(target), reduced ? 0 : 120)
  }

  function focusScan() {
    setMenuOpen(false)
    scrollToTarget('#top')
    window.setTimeout(
      () => document.getElementById('hero-url')?.focus({ preventScroll: true }),
      reduced ? 0 : 900,
    )
  }

  return (
    <header className="site-nav">
      <div className="shell nav-inner">
        <Link to="/" aria-label="Sanrakshak home">
          <Wordmark />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.target}
              href={link.target}
              className="nav-link"
              onClick={(event) => {
                event.preventDefault()
                goTo(link.target)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button type="button" className="btn btn-quiet nav-scan-btn" onClick={focusScan}>
            Scan a site
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            <i aria-hidden="true" data-open={menuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-inner shell">
              <div className="mobile-menu-head">
                <Wordmark />
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>
              <nav className="mobile-menu-links" aria-label="Mobile primary">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.target}
                    href={link.target}
                    className="mobile-menu-link display"
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.06 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={(event) => {
                      event.preventDefault()
                      goTo(link.target)
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={18} />
                  </motion.a>
                ))}
              </nav>
              <button type="button" className="btn btn-primary mobile-menu-scan" onClick={focusScan}>
                Scan a site
                <ArrowUpRight />
              </button>
              <p className="mobile-menu-note">
                Protect. Analyze. Secure. Security in plain language.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
