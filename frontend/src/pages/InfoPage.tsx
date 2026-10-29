import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { ArrowUpRight } from '../components/ui/icons'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export type InfoKind = 'docs' | 'privacy' | 'terms' | 'contact'

type InfoContent = {
  index: string
  eyebrow: string
  title: string
  lede: string
  sections: { heading: string; body: string[]; list?: string[] }[]
}

const content: Record<InfoKind, InfoContent> = {
  docs: {
    index: '01',
    eyebrow: 'Documentation',
    title: 'The manual, in plain language.',
    lede: 'The short version of what Sanrakshak checks, what it does not, and how permission works.',
    sections: [
      {
        heading: 'What a scan covers',
        body: [
          'A scan is a first automated pass across the public surface of a site. It is designed to find the common, visible problems before they become expensive ones.',
        ],
        list: [
          'Nmap maps reachable services and exposed ports.',
          'Nikto checks the server for outdated software and risky defaults.',
          'OWASP ZAP probes forms, headers and request handling.',
        ],
      },
      {
        heading: 'What it does not cover',
        body: [
          'This is not a full penetration test and it is not a guarantee. Automated scanners miss context, business logic and anything that requires a person to reason about the application. A clean report means the obvious doors were checked, not that the building is impenetrable.',
        ],
      },
      {
        heading: 'Permission comes first',
        body: [
          'Only scan a site you own or have explicit permission to test. The live product checks ownership before a scan is queued. In this preview, no live scan runs at all.',
        ],
      },
    ],
  },
  privacy: {
    index: '02',
    eyebrow: 'Privacy',
    title: 'Privacy, in short.',
    lede: 'This preview is a front-end build. It does not include accounts, analytics or a scan backend.',
    sections: [
      {
        heading: 'What this build stores',
        body: [
          'The URL entered in the hero is passed to the register route as a query parameter. It stays in the browser. The form on that page does not send anything to a server.',
        ],
        list: [
          'No analytics scripts are loaded.',
          'No account is created.',
          'No scan data is uploaded.',
          'A single sessionStorage key remembers that the intro has played.',
        ],
      },
      {
        heading: 'When the live service exists',
        body: [
          'A live scan will need to store the target, the findings and the report so you can return to them. Those details, retention periods and deletion controls will be published before the service opens.',
        ],
      },
    ],
  },
  terms: {
    index: '03',
    eyebrow: 'Terms',
    title: 'Terms for the preview.',
    lede: 'This build is a product preview, not a live security service.',
    sections: [
      {
        heading: 'Sample output is illustrative',
        body: [
          'The scan console uses sample data. It is there to show the shape of the product, not to assess a real site. Do not rely on it for a security decision.',
        ],
      },
      {
        heading: 'Scan only what you are allowed to scan',
        body: [
          'The live product will require an ownership check before a scan begins. Do not use any part of this project to test a site without permission.',
        ],
      },
      {
        heading: 'No warranty',
        body: [
          'Automated scanning catches some problems and misses others. A report is a starting point, not a guarantee that a site is secure. The live service will carry its own terms.',
        ],
      },
    ],
  },
  contact: {
    index: '04',
    eyebrow: 'Contact',
    title: 'Talk to a person.',
    lede: 'The contact route is present, but the inbox is not connected in this preview.',
    sections: [
      {
        heading: 'Before launch',
        body: [
          'A real contact address and a monitored form will be added before the service opens. Until then, use the demo to see how a scan is explained.',
        ],
      },
      {
        heading: 'For developers',
        body: [
          'The GitHub link in the footer is a placeholder. Replace it with the project repository before publishing this build.',
        ],
      },
    ],
  },
}

export function InfoPage({ kind }: { kind: InfoKind }) {
  const item = content[kind]
  useDocumentTitle(`${item.eyebrow} — Sanrakshak`)

  return (
    <PageShell>
      <section className="info-page" aria-labelledby="info-title">
        <div className="shell info-grid">
          <aside className="info-aside">
            <span className="info-index">{item.index}</span>
            <span className="info-meta">Preview build · 2026</span>
            <Link to="/" className="link-underline info-back">
              <span>Back to the site</span>
              <ArrowUpRight />
            </Link>
          </aside>

          <div className="info-body">
            <p className="eyebrow">{item.eyebrow}</p>
            <h1 className="info-title" id="info-title">
              {item.title}
            </h1>
            <p className="info-lede">{item.lede}</p>

            <div className="info-sections">
              {item.sections.map((section, index) => (
                <article className="info-section" key={section.heading}>
                  <span className="info-section-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2>{section.heading}</h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.list && (
                      <ul>
                        {section.list.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {kind === 'docs' ? (
              <a href="/#demo" className="btn info-cta">
                See the demo
                <ArrowUpRight />
              </a>
            ) : (
              <Link to="/" className="btn info-cta">
                Return to Sanrakshak
                <ArrowUpRight />
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
