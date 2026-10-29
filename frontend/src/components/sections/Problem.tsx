import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Counter } from '../ui/Counter'

gsap.registerPlugin(ScrollTrigger)

const lines = [
  ['Most', 'websites', 'launch', 'unprotected.'],
  ['The', 'tools', 'exist.'],
  ['The', 'language', "doesn't."],
]

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', section)
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="problem" id="problem" ref={sectionRef} aria-labelledby="problem-title">
      <div className="problem-sticky">
        <div className="shell">
          <div className="problem-grid">
            <h2 className="problem-statement" id="problem-title">
              {lines.map((line, lineIndex) => (
                <span className="line" key={lineIndex}>
                  {line.map((word, wordIndex) => (
                    <span className="word" data-word key={`${lineIndex}-${wordIndex}`}>
                      {word === 'unprotected.' ? <em>{word}</em> : word}
                      {wordIndex < line.length - 1 ? '\u00A0' : ''}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <div className="problem-aside">
              <p>
                Nmap, Nikto and OWASP ZAP were built for people who read raw output
                for a living. Everyone else gets a wall of ports, payloads and
                warnings — and no idea what to fix first.
              </p>
              <p>
                Sanrakshak keeps the scanners. It replaces the wall with a sentence
                you can act on.
              </p>
            </div>
          </div>

          <div className="counter-grid" aria-label="How Sanrakshak simplifies a scan">
            <div className="counter">
              <Counter value={3} className="counter-value" />
              <span className="counter-label">Scan engines behind one queue</span>
            </div>
            <div className="counter">
              <Counter value={1} className="counter-value" />
              <span className="counter-label">Verdict you can actually read</span>
            </div>
            <div className="counter">
              <Counter value={0} className="counter-value" />
              <span className="counter-label">Dashboards you have to learn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
