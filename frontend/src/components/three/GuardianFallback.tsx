import fallbackImage from '../../assets/guardian-fallback.svg'

type GuardianFallbackProps = {
  className?: string
}

export function GuardianFallback({ className = '' }: GuardianFallbackProps) {
  return (
    <div className={`hero-fallback ${className}`.trim()} aria-hidden="true">
      <img src={fallbackImage} alt="" />
      <span className="fallback-beam" />
    </div>
  )
}
