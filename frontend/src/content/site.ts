export type FeatureGlyphName =
  | 'ports'
  | 'server'
  | 'web'
  | 'ai'
  | 'score'
  | 'history'
  | 'report'

export type Feature = {
  kicker: string
  title: string
  body: string
  glyph: FeatureGlyphName
  size: 'wide' | 'narrow' | 'third' | 'two-thirds'
  tall?: boolean
  inverted?: boolean
}

export const navLinks = [
  { label: 'How it works', target: '#how-it-works' },
  { label: 'Demo', target: '#demo' },
  { label: 'Pricing', target: '#pricing' },
]

export const features: Feature[] = [
  {
    kicker: 'Nmap',
    title: 'Port detection',
    body: 'Maps every reachable port and service, so you know exactly what your server is telling the internet.',
    glyph: 'ports',
    size: 'wide',
    tall: true,
  },
  {
    kicker: 'Nikto',
    title: 'Server checks',
    body: 'Finds outdated software, risky defaults and the small misconfigurations that become entry points.',
    glyph: 'server',
    size: 'narrow',
  },
  {
    kicker: 'OWASP ZAP',
    title: 'Web app testing',
    body: 'Probes forms, headers and request handling for the flaws a scanner can catch before a person does.',
    glyph: 'web',
    size: 'narrow',
  },
  {
    kicker: 'Plain language',
    title: 'Nothing lost in translation.',
    body: 'Upload the noise. Get the point. Every finding is rewritten around impact and the next action, not the jargon.',
    glyph: 'ai',
    size: 'wide',
    inverted: true,
  },
  {
    kicker: 'Verdict',
    title: 'Security score',
    body: 'A 0–100 number that moves in plain sight. Track whether a fix actually made things safer.',
    glyph: 'score',
    size: 'third',
  },
  {
    kicker: 'Memory',
    title: 'Scan history',
    body: 'Every run is dated and compared, so regressions do not hide between deploys.',
    glyph: 'history',
    size: 'third',
  },
  {
    kicker: 'Hand-off',
    title: 'Reports',
    body: 'Export a clean PDF, HTML or Markdown report for a client, a developer or your future self.',
    glyph: 'report',
    size: 'third',
  },
]

export const audiences = [
  'Students',
  'Freelancers',
  'Startups',
  'Small businesses',
]

export type PricingTier = {
  tier: string
  name: string
  line: string
  items: { label: string; muted?: boolean }[]
  cta: string
  featured?: boolean
}

export const pricing: PricingTier[] = [
  {
    tier: 'Free',
    name: 'A first look',
    line: 'For the first honest answer about what is exposed.',
    items: [
      { label: '1 scan per month' },
      { label: 'Nmap, Nikto and OWASP ZAP' },
      { label: 'Plain-language summary' },
      { label: 'Score and report download' },
    ],
    cta: 'Start free',
  },
  {
    tier: 'Pro',
    name: 'Keep watch',
    line: 'For the person who ships the site and then has to defend it.',
    items: [
      { label: '20 scans per month' },
      { label: 'Everything in Free' },
      { label: 'Scan history and diffs' },
      { label: 'Priority scan queue' },
      { label: 'PDF, HTML and Markdown exports' },
    ],
    cta: 'Join early access',
    featured: true,
  },
  {
    tier: 'Agency',
    name: 'Many doors',
    line: 'For teams responsible for more than one front door.',
    items: [
      { label: 'Unlimited sites' },
      { label: 'Everything in Pro' },
      { label: 'Client-ready reports' },
      { label: 'Multiple team seats' },
      { label: 'Priority support' },
    ],
    cta: 'Talk to us',
  },
]

export const footerLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

export const steps = [
  {
    index: '01',
    kicker: 'Enter',
    title: 'Start with a URL.',
    body: 'Paste the site you own. We confirm permission, queue the scan, and tell you what is being tested before it starts.',
  },
  {
    index: '02',
    kicker: 'Scan',
    title: 'Three scanners. One pass.',
    body: 'Nmap maps the exposed services. Nikto checks the server. OWASP ZAP probes the application. You do not have to configure any of it.',
  },
  {
    index: '03',
    kicker: 'Translate',
    title: 'The machine reports. The AI explains.',
    body: 'Raw output becomes plain language: what was found, why it matters, and what to fix first.',
  },
  {
    index: '04',
    kicker: 'Report',
    title: 'Leave with a plan.',
    body: 'A 0–100 score, prioritised fixes, and a report you can send to a developer or keep for the next deploy.',
  },
]
