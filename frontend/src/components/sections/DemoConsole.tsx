import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  demoTarget,
  demoLines,
  findings,
  severityOrder,
  type Severity,
} from '../../content/demo'
import { useInView } from '../../lib/useInView'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Counter } from '../ui/Counter'
import { SeverityMark } from '../ui/SeverityMark'
import { ArrowUpRight, ShieldFallback } from '../ui/icons'

const tabs = ['terminal', 'findings', 'summary'] as const
type DemoTab = (typeof tabs)[number]

const demoObserver = { threshold: 0.18 }

const severityCounts = findings.reduce<Record<Severity, number>>(
  (counts, finding) => {
    counts[finding.severity] += 1
    return counts
  },
  { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
)

function ScoreDial({ score, active }: { score: number; active: boolean }) {
  const reduced = useReducedMotion()
  const offset = 1 - score / 100

  return (
    <svg
      className="score-dial"
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Sample security score: ${score} out of 100`}
    >
      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="square"
        transform="rotate(-90 50 50)"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: active ? offset : 1 }}
        transition={{ duration: reduced ? 0 : 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

function TerminalPanel({
  visible,
  running,
  onReplay,
}: {
  visible: number
  running: boolean
  onReplay: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = bodyRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [visible])

  return (
    <div className="terminal">
      <div className="terminal-head">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{demoTarget.replace('https://', '')}</span>
        <span className="sample-badge">Sample data</span>
      </div>

      <div
        className="terminal-body"
        ref={bodyRef}
        role="log"
        aria-label="Simulated scan output"
        aria-live="off"
      >
        {demoLines.slice(0, visible).map((line, index) => (
          <div className="term-line" data-kind={line.kind} key={`${line.text}-${index}`}>
            <span className="term-time">{String(index + 1).padStart(2, '0')}</span>
            <span>{line.text}</span>
          </div>
        ))}
        {visible === 0 && (
          <div className="terminal-empty">Waiting for permission to scan…</div>
        )}
        {running && visible > 0 && <span className="caret" aria-hidden="true" />}
      </div>

      <div className="terminal-foot">
        <span className="terminal-status">
          <span className={`status-dot ${running ? 'is-running' : ''}`} />
          {running ? 'Scanning' : 'Scan complete'}
        </span>
        <button type="button" className="btn btn-quiet" onClick={onReplay}>
          {reduced ? 'Show full output' : 'Replay'}
        </button>
      </div>
    </div>
  )
}

function FindingsPanel() {
  return (
    <div className="findings-panel demo-panel">
      <div className="demo-panel-head">
        <span>06 findings · sample data</span>
        <span>prioritised</span>
      </div>
      <div className="findings-list">
        {findings.map((finding) => (
          <article className="finding" key={finding.title}>
            <span className="finding-sev" data-severity={finding.severity}>
              <SeverityMark severity={finding.severity} />
              {finding.severity}
            </span>
            <div>
              <h3 className="finding-title">{finding.title}</h3>
              <p className="finding-detail">
                {finding.target} — {finding.detail}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function SummaryPanel() {
  return (
    <div className="demo-panel summary-panel">
      <div className="demo-panel-head">
        <span>summary · sample data</span>
        <span>64 / 100</span>
      </div>
      <p className="summary-lede">
        The site is reachable and mostly configured. One public admin panel is
        the urgent issue. The next two fixes are response headers and TLS.
      </p>
      <div className="summary-counts">
        {severityOrder.map((severity) => (
          <span key={severity}>
            <SeverityMark severity={severity} />
            {severityCounts[severity]} {severity}
          </span>
        ))}
      </div>
      <ol className="summary-actions">
        <li>
          <span>01</span>
          Close the public admin panel.
        </li>
        <li>
          <span>02</span>
          Add a Content-Security-Policy and stop disclosing the server version.
        </li>
        <li>
          <span>03</span>
          Turn off TLS 1.0 and 1.1, then re-scan.
        </li>
      </ol>
    </div>
  )
}

export function DemoConsole() {
  const reduced = useReducedMotion()
  const [tab, setTab] = useState<DemoTab>('terminal')
  const [visible, setVisible] = useState(reduced ? demoLines.length : 0)
  const [run, setRun] = useState(0)
  const { ref, inView } = useInView<HTMLElement>(demoObserver)

  const running = visible < demoLines.length
  const topFindings = useMemo(() => findings.slice(0, 3), [])

  useEffect(() => {
    if (reduced) {
      setVisible(demoLines.length)
      return
    }
    if (!inView) {
      setVisible(0)
      return
    }

    setVisible(0)
    let index = 0
    let timer = 0

    function schedule() {
      if (index >= demoLines.length) return
      timer = window.setTimeout(() => {
        index += 1
        setVisible(index)
        if (index < demoLines.length) schedule()
      }, demoLines[index]?.after ?? 300)
    }

    timer = window.setTimeout(schedule, 420)
    return () => window.clearTimeout(timer)
  }, [inView, reduced, run])

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const current = tabs.indexOf(tab)
    let next = current
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    setTab(tabs[next])
    document.getElementById(`demo-tab-${tabs[next]}`)?.focus()
  }

  return (
    <section className="section demo-section" id="demo" ref={ref} aria-labelledby="demo-title">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="eyebrow">Demo</p>
            <h2 className="display display-lg" id="demo-title">
              Watch a scan <em>think.</em>
            </h2>
          </div>
          <div>
            <p className="lede">
              A simulated pass over a sample site. See the raw scanners, the plain
              verdict and the fixes in the order they should happen.
            </p>
            <p className="demo-disclaimer">
              Sample data only. No request is sent and no live site is scanned.
            </p>
          </div>
        </div>

        <div className="demo-tabs" role="tablist" aria-label="Demo views" onKeyDown={onTabKeyDown}>
          {tabs.map((item) => (
            <button
              type="button"
              role="tab"
              id={`demo-tab-${item}`}
              aria-selected={tab === item}
              aria-controls={`demo-panel-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className="demo-tab"
              key={item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="demo-grid">
          <div
            className="demo-main"
            role="tabpanel"
            id={`demo-panel-${tab}`}
            aria-labelledby={`demo-tab-${tab}`}
            tabIndex={0}
          >
            {tab === 'terminal' && (
              <TerminalPanel
                visible={visible}
                running={running}
                onReplay={() => {
                  setRun((value) => value + 1)
                  setTab('terminal')
                }}
              />
            )}
            {tab === 'findings' && <FindingsPanel />}
            {tab === 'summary' && <SummaryPanel />}
          </div>

          <aside className="demo-side" aria-label="Sample scan overview">
            <div className="score-block">
              <ScoreDial score={64} active={inView} />
              <div>
                <Counter value={64} className="score-number" />
                <span className="score-caption">Sample security score</span>
              </div>
            </div>

            <div className="demo-side-head">
              <span>Top findings</span>
              <button
                type="button"
                className="link-underline"
                onClick={() => setTab('findings')}
              >
                <span>All {findings.length}</span>
                <ArrowUpRight />
              </button>
            </div>

            <div className="findings-list">
              {topFindings.map((finding) => (
                <article className="finding" key={finding.title}>
                  <span className="finding-sev" data-severity={finding.severity}>
                    <SeverityMark severity={finding.severity} />
                    {finding.severity}
                  </span>
                  <div>
                    <h3 className="finding-title">{finding.title}</h3>
                    <p className="finding-detail">{finding.target}</p>
                  </div>
                </article>
              ))}
            </div>

            <Link to="/register" className="btn btn-primary demo-cta">
              Scan your own site
              <ArrowUpRight />
            </Link>

            <p className="demo-side-note">
              <ShieldFallback /> Permission is checked before any scan begins.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
