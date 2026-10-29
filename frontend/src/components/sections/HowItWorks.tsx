import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { steps } from '../../content/site'
import { demoTarget } from '../../content/demo'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useWebGLSupport } from '../../lib/useWebGLSupport'
import { useDeferredMount } from '../../lib/useDeferredMount'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { Counter } from '../ui/Counter'
import { DownloadMark } from '../ui/icons'
import { ScrambleText } from '../ui/ScrambleText'

const HowItWorksCanvas = lazy(() => import('../three/HowItWorksCanvas'))

function EnterCard() {
  const reduced = useReducedMotion()
  const [typed, setTyped] = useState(reduced ? demoTarget : '')
  const [done, setDone] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setTyped(demoTarget)
      setDone(true)
      return
    }

    setTyped('')
    setDone(false)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTyped(demoTarget.slice(0, index))
      if (index >= demoTarget.length) {
        window.clearInterval(timer)
        setDone(true)
      }
    }, 34)

    return () => window.clearInterval(timer)
  }, [reduced])

  return (
    <div className="step-card">
      <div className="step-card-head">
        <span>scan queue / 01</span>
        <span>{done ? 'ready' : 'waiting'}</span>
      </div>
      <div className="step-card-title">Enter a site</div>
      <div className="typing-window">
        <div className="typing-line">
          <span className="prompt">$</span>
          <span>{typed}</span>
          <span className="caret" />
        </div>
      </div>
      <p className={`typing-status ${done ? 'is-done' : ''}`}>
        <span className="status-dot" />
        {done ? 'Authorisation check passed.' : 'Checking ownership before any packet is sent.'}
      </p>
      <div className="step-card-foot">
        <span>Scope confirmed first</span>
        <span>enter ↵</span>
      </div>
    </div>
  )
}

function ScanCard() {
  return (
    <div className="step-card">
      <div className="step-card-head">
        <span>engines / 03</span>
        <span>live pass</span>
      </div>
      <div className="step-card-title">Three scanners</div>
      <div className="scanner-list">
        <div className="scanner-row">
          <span>NMAP</span>
          <span className="scanner-bar">
            <i />
          </span>
          <span>ports</span>
        </div>
        <div className="scanner-row">
          <span>NIKTO</span>
          <span className="scanner-bar">
            <i />
          </span>
          <span>server</span>
        </div>
        <div className="scanner-row">
          <span>ZAP</span>
          <span className="scanner-bar">
            <i />
          </span>
          <span>web</span>
        </div>
      </div>
      <p style={{ marginTop: '1.3rem' }}>
        One queue. One pass. No scanner configuration, no plugins, no flags to
        remember.
      </p>
    </div>
  )
}

function TranslateCard() {
  return (
    <div className="step-card">
      <div className="step-card-head">
        <span>translation / ai</span>
        <span>plain english</span>
      </div>
      <div className="step-card-title">
        Before <em>→</em> after
      </div>
      <div className="translate-card">
        <div className="translate-half raw">
          {'+ /admin/ [200] no auth\n+ csp header missing\n+ tlsv1 accepted'}
        </div>
        <div className="translate-half plain">
          <b>Your admin panel is public.</b> Close it first. Then add a content
          policy and turn off TLS 1.0.
        </div>
        <div className="translate-wipe" />
      </div>
      <p style={{ marginTop: '1rem' }}>
        Each finding is rewritten around impact and the next action.
      </p>
    </div>
  )
}

function ReportCard() {
  return (
    <div className="step-card">
      <div className="step-card-head">
        <span>report / 04</span>
        <span>ready</span>
      </div>
      <div className="step-card-title">Leave with a plan</div>
      <div className="score-line">
        <Counter value={92} className="score-number" />
        <span>/ 100 after fixes</span>
      </div>
      <p style={{ marginTop: '0.6rem' }}>
        Prioritised fixes, dated history, and a report you can hand over.
      </p>
      <div className="report-cards">
        <div className="report-card">
          PDF <span>client-ready</span>
        </div>
        <div className="report-card">
          HTML <span>shareable</span>
        </div>
        <div className="report-card">
          MD <span>for developers</span>
        </div>
      </div>
      <div className="step-card-foot">
        <span>
          <DownloadMark /> Export report
        </span>
        <span>sample data</span>
      </div>
    </div>
  )
}

function StepVisual({ index }: { index: number }) {
  if (index === 0) return <EnterCard />
  if (index === 1) return <ScanCard />
  if (index === 2) return <TranslateCard />
  return <ReportCard />
}

function StaticSteps() {
  return (
    <div className="hiw-static-list">
      {steps.map((step, index) => (
        <article className="hiw-static-step" key={step.index}>
          <div className="hiw-static-copy">
            <p className="step-index">
              {step.index} / {step.kicker}
            </p>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-body">{step.body}</p>
          </div>
          <div className="step-visual" aria-hidden="true">
            <StepVisual index={index} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 700px)')
  const staticMode = reduced || mobile
  const webgl = useWebGLSupport()
  const show3D = useDeferredMount(webgl && !staticMode, 1100)
  const step = steps[active]

  useEffect(() => {
    if (staticMode) return
    const section = sectionRef.current
    if (!section) return

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
        const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))
        if (next !== activeRef.current) {
          activeRef.current = next
          setActive(next)
        }
      },
    })

    return () => trigger.kill()
  }, [staticMode])

  if (staticMode) {
    return (
      <section
        className="hiw hiw-static"
        id="how-it-works"
        ref={sectionRef}
        aria-labelledby="hiw-heading"
      >
        <div className="shell section-head">
          <p className="eyebrow">How it works</p>
          <h2 className="display display-lg" id="hiw-heading">
            Four moves from <em>unknown</em> to <em>action.</em>
          </h2>
        </div>
        <div className="shell">
          <StaticSteps />
        </div>
      </section>
    )
  }

  return (
    <section className="hiw" id="how-it-works" ref={sectionRef} aria-labelledby="hiw-heading">
      <div className="hiw-sticky">
        <div className="hiw-fallback" aria-hidden="true" />
        {webgl && show3D && (
          <Suspense fallback={null}>
            <HowItWorksCanvas progressRef={progressRef} />
          </Suspense>
        )}
        <div className="hiw-scrim" aria-hidden="true" />

        <p className="hiw-header" aria-hidden="true">
          The scan, in four moves
        </p>

        <div className="shell hiw-overlay">
          <h2 className="sr-only" id="hiw-heading">
            How Sanrakshak works
          </h2>

          <div className="hiw-copy">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="step-index">
                  {step.index} / {step.kicker}
                </p>
                <h3 className="step-title">
                  <ScrambleText key={active} text={step.title} />
                </h3>
                <p className="step-body">{step.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="step-visual" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <StepVisual index={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="step-rail" aria-hidden="true">
          {steps.map((item, index) => (
            <span key={item.index} data-active={index === active}>
              {item.index} {item.kicker}
            </span>
          ))}
        </div>

        <div className="sr-only">
          {steps.map((item) => (
            <div key={item.index}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
