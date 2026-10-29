import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { audiences } from '../../content/site'
import { useReducedMotion } from '../../lib/useReducedMotion'

const groupItems = [...audiences, ...audiences, ...audiences]

export function Audience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const track = trackRef.current
    if (!track) return

    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 38,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tweenRef.current?.kill()
      tweenRef.current = null
    }
  }, [reduced])

  return (
    <section className="audience" id="who" aria-labelledby="audience-title">
      <div className="shell audience-head">
        <div>
          <p className="eyebrow">Who it is for</p>
          <h2 className="display display-lg" id="audience-title">
            Built for the people who <em>own the door.</em>
          </h2>
        </div>
        <p className="audience-note">
          Students, freelancers, startups and small businesses. If you are
          responsible for a site and not a security team, this is for you.
        </p>
      </div>

      <div className="audience-motion">
        <div
          className="marquee"
          aria-hidden="true"
          onPointerEnter={() => tweenRef.current?.pause()}
          onPointerLeave={() => tweenRef.current?.play()}
        >
          <div className="marquee-track" ref={trackRef}>
            {[0, 1].map((group) => (
              <div className="marquee-group" key={group}>
                {groupItems.map((item, index) => (
                  <span
                    className={`marquee-item ${index % 2 === 1 ? 'outline' : ''}`.trim()}
                    key={`${group}-${item}-${index}`}
                  >
                    {item}
                    <span className="marquee-star" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="audience-static">
        {audiences.map((item) => (
          <li key={item}>
            {item}
            <span className="marquee-star" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  )
}
