import { ShieldMark } from '../ui/icons'

type WordmarkProps = {
  className?: string
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      <ShieldMark size={16} />
      Sanrakshak
    </span>
  )
}
