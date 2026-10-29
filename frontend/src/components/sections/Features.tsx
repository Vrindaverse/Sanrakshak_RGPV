import { features } from '../../content/site'
import { FeatureGlyph } from '../ui/FeatureGlyph'
import { TiltCard } from '../ui/TiltCard'

export function Features() {
  return (
    <section className="section" id="features" aria-labelledby="features-title">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">What is inside</p>
            <h2 className="display display-lg" id="features-title">
              The full picture. <em>Without the noise.</em>
            </h2>
          </div>
          <p className="lede">
            Three scanners do the technical work. The interface does the part
            that usually gets skipped: telling you what matters.
          </p>
        </div>

        <div className="bento">
          {features.map((feature) => (
            <TiltCard
              key={feature.title}
              className={feature.inverted ? 'inverted' : ''}
              data-size={feature.size}
              data-tall={feature.tall ? 'true' : 'false'}
            >
              <div className="feature-top">
                <span className="feature-kicker">{feature.kicker}</span>
                <FeatureGlyph name={feature.glyph} />
              </div>
              <div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-body">{feature.body}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
