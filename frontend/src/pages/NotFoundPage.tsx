import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { ArrowUpRight } from '../components/ui/icons'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found — Sanrakshak')

  return (
    <PageShell>
      <section className="info-page" aria-labelledby="notfound-title">
        <div className="shell info-grid">
          <aside className="info-aside">
            <span className="info-index">404</span>
            <span className="info-meta">Off the map</span>
          </aside>
          <div className="info-body">
            <p className="eyebrow">Not found</p>
            <h1 className="info-title" id="notfound-title">
              This page is not here.
            </h1>
            <p className="info-lede">
              The address may have changed, or the page may not exist yet.
            </p>
            <Link to="/" className="btn info-cta">
              Return to Sanrakshak
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
