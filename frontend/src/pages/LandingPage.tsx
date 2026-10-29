import { useCallback, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Preloader } from '../components/layout/Preloader'
import { Audience } from '../components/sections/Audience'
import { DemoConsole } from '../components/sections/DemoConsole'
import { Features } from '../components/sections/Features'
import { FinalCTA } from '../components/sections/FinalCTA'
import { Footer } from '../components/sections/Footer'
import { Hero } from '../components/sections/Hero'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Pricing } from '../components/sections/Pricing'
import { Problem } from '../components/sections/Problem'
import { Trust } from '../components/sections/Trust'
import { hasSeenIntro } from '../lib/intro'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useSmoothScroll } from '../lib/useSmoothScroll'

export function LandingPage() {
  const reduced = useReducedMotion()
  const [introDone, setIntroDone] = useState(() => hasSeenIntro())
  const finishIntro = useCallback(() => setIntroDone(true), [])

  useSmoothScroll(!reduced)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!introDone && !reduced && <Preloader onComplete={finishIntro} />}
      <Navbar />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <HowItWorks />
        <DemoConsole />
        <Features />
        <Audience />
        <Pricing />
        <Trust />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
