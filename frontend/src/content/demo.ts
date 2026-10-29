export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type TermKind = 'cmd' | 'ok' | 'warn' | 'crit' | 'muted'

export type DemoLine = {
  after: number
  kind: TermKind
  text: string
}

export type Finding = {
  severity: Severity
  title: string
  target: string
  detail: string
}

export const demoTarget = 'https://northstar-studio.example'

export const demoLines: DemoLine[] = [
  { after: 0, kind: 'cmd', text: `sanrakshak scan ${demoTarget}` },
  { after: 360, kind: 'muted', text: 'Resolving host... 203.0.113.42' },
  { after: 260, kind: 'ok', text: 'Scope confirmed. Authorised by site owner.' },
  { after: 220, kind: 'muted', text: 'Engines: nmap 7.95 / nikto 2.5.0 / zap 2.15' },
  { after: 380, kind: 'ok', text: 'nmap    starting service discovery' },
  { after: 420, kind: 'ok', text: 'nmap    22/tcp  open  ssh   OpenSSH 8.2p1' },
  { after: 220, kind: 'ok', text: 'nmap    80/tcp  open  http  nginx 1.18.0' },
  { after: 200, kind: 'ok', text: 'nmap    443/tcp open  ssl/http  nginx 1.18.0' },
  { after: 360, kind: 'ok', text: 'nikto   checking 6,842 potential items' },
  { after: 520, kind: 'warn', text: 'nikto   + server leaks nginx version' },
  { after: 280, kind: 'crit', text: 'nikto   + /admin/ responds without authentication' },
  { after: 440, kind: 'ok', text: 'zap     spidering 34 URLs' },
  { after: 620, kind: 'warn', text: 'zap     alert: Content-Security-Policy header missing' },
  { after: 260, kind: 'warn', text: 'zap     alert: TLS 1.0 accepted' },
  { after: 420, kind: 'ok', text: 'ai      translating findings into plain language' },
  { after: 520, kind: 'ok', text: 'report  6 findings  ·  1 critical  ·  2 high  ·  1 medium  ·  1 low  ·  1 info' },
  { after: 420, kind: 'crit', text: 'done    score 64/100  ·  action recommended' },
]

export const findings: Finding[] = [
  {
    severity: 'critical',
    title: 'Admin panel is public',
    target: '/admin/',
    detail: 'Returned 200 without a login prompt. This is the first thing to close.',
  },
  {
    severity: 'high',
    title: 'No Content-Security-Policy',
    target: 'response headers',
    detail: 'Browsers have no instruction about which scripts may run, so one injected script can travel further than it should.',
  },
  {
    severity: 'high',
    title: 'Old TLS still accepted',
    target: 'port 443',
    detail: 'TLS 1.0 and 1.1 are enabled. Modern browsers will warn; older clients may downgrade.',
  },
  {
    severity: 'medium',
    title: 'Server version disclosed',
    target: 'response headers',
    detail: 'Responses advertise nginx/1.18.0. Remove the version to make fingerprinting harder.',
  },
  {
    severity: 'low',
    title: 'Directory listing enabled',
    target: '/assets/',
    detail: 'The assets folder lists files to anyone who visits. Turn autoindex off.',
  },
  {
    severity: 'info',
    title: 'SPF record present',
    target: 'DNS TXT',
    detail: 'An email sender policy exists. No action needed.',
  },
]

export const severityOrder: Severity[] = [
  'critical',
  'high',
  'medium',
  'low',
  'info',
]
