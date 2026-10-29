import { Link } from 'react-router-dom'
import { footerLinks } from '../../content/site'
import { scrollToTarget } from '../../lib/scroll'
import { Wordmark } from '../layout/Wordmark'
import { ArrowUp } from '../ui/icons'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-mark">
            <Wordmark />
            <span className="footer-tag">
              Protect. Analyze. Secure. In words that make sense.
            </span>
          </div>

          <nav className="footer-links" aria-label="Footer">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  className="footer-link"
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.label}
                </a>
              ) : (
                <Link className="footer-link" to={link.href} key={link.label}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sanrakshak. All rights reserved.</span>
          <span>Sample reports are illustrative, not a guarantee.</span>
          <button
            type="button"
            className="back-to-top"
            onClick={() => scrollToTarget('#top')}
          >
            Back to top
            <ArrowUp />
          </button>
        </div>
      </div>
    </footer>
  )
}
