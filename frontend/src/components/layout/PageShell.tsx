import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import { ArrowUpRight } from '../ui/icons'

type PageShellProps = {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#page-main">
        Skip to content
      </a>

      <header className="page-nav">
        <div className="shell page-nav-inner">
          <Link to="/" aria-label="Sanrakshak home">
            <Wordmark />
          </Link>
          <Link to="/" className="link-underline">
            <span>Back to site</span>
            <ArrowUpRight />
          </Link>
        </div>
      </header>

      <main id="page-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="page-foot">
        <div className="shell page-foot-inner">
          <span>© {new Date().getFullYear()} Sanrakshak</span>
          <span>Protect. Analyze. Secure.</span>
          <span>Sample build</span>
        </div>
      </footer>
    </div>
  )
}
