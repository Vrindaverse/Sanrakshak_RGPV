import { Link } from 'react-router-dom'
import { pricing } from '../../content/site'
import { ArrowUpRight, ShieldMark } from '../ui/icons'

export function Pricing() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="display display-lg" id="pricing-title">
              Start where you are. <em>Scale when you need.</em>
            </h2>
          </div>
          <p className="lede">
            A first scan should not require a sales call. Start free, keep the
            report, and decide what the next layer of protection is worth.
          </p>
        </div>

        <div className="pricing-grid">
          {pricing.map((tier, index) => (
            <article
              className={`price-card ${tier.featured ? 'featured' : ''}`.trim()}
              key={tier.tier}
            >
              <div className="price-top">
                <span>{tier.tier}</span>
                <span>{tier.featured ? 'Most chosen' : String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="price-name">{tier.name}</h3>
              <p className="price-line">{tier.line}</p>
              <ul className="price-list">
                {tier.items.map((item) => (
                  <li key={item.label} data-muted={item.muted || undefined}>
                    {item.label}
                  </li>
                ))}
              </ul>
              <Link
                to={tier.cta === 'Talk to us' ? '/contact' : '/register'}
                className={`btn ${tier.featured ? 'btn-invert' : ''}`.trim()}
              >
                {tier.cta}
                <ArrowUpRight />
              </Link>
            </article>
          ))}
        </div>

        <p className="pricing-note">
          <ShieldMark /> No card required for the first scan. Permission is
          checked before every run. Early-access plans may change.
        </p>
      </div>
    </section>
  )
}
