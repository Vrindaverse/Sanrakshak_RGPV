import { ShieldFallback } from '../ui/icons'

const points = [
  {
    index: '01',
    title: 'Permission first',
    copy: 'A scan only starts after an ownership check. You are told what will be tested before it begins.',
  },
  {
    index: '02',
    title: 'Plain language',
    copy: 'Every finding is written around impact and one clear action. No raw dump with no next step.',
  },
  {
    index: '03',
    title: 'Honest limits',
    copy: 'Automated scanning catches what it can catch. It is a first pass, not a guarantee.',
  },
]

export function Trust() {
  return (
    <section className="trust" id="trust" aria-labelledby="trust-title">
      <div className="shell">
        <div className="trust-grid">
          <div>
            <p className="eyebrow">The standard</p>
            <h2 className="trust-statement" id="trust-title">
              Security should not require a <em>translator.</em>
            </h2>
          </div>
          <div className="trust-copy">
            <p>
              Sanrakshak is built around a simple rule: the person who owns the
              site should be able to understand the report.
            </p>
            <p>
              No black boxes. No scare tactics. No score without an explanation.
            </p>
          </div>
        </div>

        <div className="trust-points">
          {points.map((point) => (
            <div className="trust-point" key={point.index}>
              <span className="trust-point-index">{point.index}</span>
              <span className="trust-point-title">{point.title}</span>
              <span className="trust-point-copy">{point.copy}</span>
            </div>
          ))}
        </div>

        <div className="trust-grid" style={{ marginTop: 'clamp(3rem, 7vw, 5rem)' }}>
          <p className="lede" style={{ color: 'var(--paper-muted)', maxWidth: '30rem' }}>
            A first pass, written for the person who has to act on it. That is
            the whole product.
          </p>
          <ShieldFallback className="trust-mark" />
        </div>
      </div>
    </section>
  )
}
