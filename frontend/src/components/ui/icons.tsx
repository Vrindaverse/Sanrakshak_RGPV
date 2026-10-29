type IconProps = {
  className?: string
  size?: number
}

export function ShieldMark({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 1.18}
      viewBox="0 0 20 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 1 18 4.5v6.2c0 5.1-3.2 9.2-8 12.1-4.8-2.9-8-7-8-12.1V4.5L10 1Z" stroke="currentColor" strokeWidth="1" />
      <path d="M10 4.2v14.2" stroke="currentColor" strokeWidth="1" opacity=".45" />
    </svg>
  )
}

export function ArrowUpRight({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 11 11 3M4.4 3H11v6.6" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ArrowDown({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 2v10M2.8 7.8 7 12l4.2-4.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ArrowUp({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 12V2M2.8 6.2 7 2l4.2 4.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function PlusMark({ className, size = 12 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function DownloadMark({ className, size = 14 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 1v8M3.6 6.2 7 9.6l3.4-3.4M2 12h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ShieldFallback({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 460"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="200" cy="206" r="184" opacity=".22" />
        <circle cx="200" cy="206" r="144" opacity=".12" />
        <circle cx="200" cy="206" r="104" opacity=".09" />
        <path d="M200 32 322 82v104c0 92-54 164-122 206-68-42-122-114-122-206V82L200 32Z" opacity=".8" />
        <path d="M200 58v330" opacity=".22" />
        <path d="M78 186h244" opacity=".12" />
        <path d="M200 32 78 82M200 32l122 50" opacity=".35" />
        <path d="m200 94 72 30v68c0 55-32 98-72 123-40-25-72-68-72-123v-68l72-30Z" opacity=".5" />
      </g>
      <path
        d="M200 94v221"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".4"
      />
    </svg>
  )
}
