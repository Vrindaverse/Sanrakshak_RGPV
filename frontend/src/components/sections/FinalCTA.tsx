import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useWebGLSupport } from '../../lib/useWebGLSupport'
import { useDeferredMount } from '../../lib/useDeferredMount'
import { scrollToTarget } from '../../lib/scroll'
import { ArrowDown, ArrowUpRight, ShieldFallback } from '../ui/icons'

const EchoCanvas = lazy(() => import('../three/EchoCanvas'))

export function FinalCTA() {
  const reduced = useReducedMotion()
  const webgl = useWebGLSupport()
  const show3D = useDeferredMount(webgl && !reduced, 1300)

  return (
    <section className="final-cta" id="start" aria-labelledby="final-title">
      <div className="final-fallback" aria-hidden="true">
        <ShieldFallback className="final-fallback-mark" />
      </div>
      {webgl && show3D && (
        <Suspense fallback={null}>
          <EchoCanvas />
        </Suspense>
      )}
      <div className="final-scrim" aria-hidden="true" />

      <div className="shell final-inner">
        <p className="eyebrow final-eyebrow">The first step</p>
        <h2 className="final-title" id="final-title">
          Find out what is exposed.
          <br />
          <em>Before it becomes a problem.</em>
        </h2>
        <p className="final-sub">
          One URL. One plain-language report. Start with the front door.
        </p>
        <div className="final-actions">
          <Link to="/register" className="btn btn-primary">
            Run your first scan
            <ArrowUpRight />
          </Link>
          <button
            type="button"
            className="btn"
            onClick={() => scrollToTarget('#demo')}
          >
            See the demo
            <ArrowDown />
          </button>
        </div>
        <p className="final-meta">
          Permission checked before scanning · Sample report available · No card
          required
        </p>
      </div>
    </section>
  )
}
