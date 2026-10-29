import type { Severity } from '../../content/demo'

type SeverityMarkProps = {
  severity: Severity
  className?: string
}

export function SeverityMark({ severity, className = '' }: SeverityMarkProps) {
  return (
    <svg
      className={`sev-mark ${className}`.trim()}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      {severity === 'critical' && (
        <path d="M6 .8 11.2 6 6 11.2.8 6 6 .8Z" fill="currentColor" />
      )}
      {severity === 'high' && (
        <>
          <rect x="1.4" y="1.4" width="9.2" height="9.2" stroke="currentColor" />
          <rect x="1.4" y="1.4" width="4.6" height="9.2" fill="currentColor" />
        </>
      )}
      {severity === 'medium' && (
        <path d="M6 1.2 11 10.6H1L6 1.2Z" stroke="currentColor" />
      )}
      {severity === 'low' && <circle cx="6" cy="6" r="4.4" stroke="currentColor" />}
      {severity === 'info' && <circle cx="6" cy="6" r="1.9" fill="currentColor" />}
    </svg>
  )
}
