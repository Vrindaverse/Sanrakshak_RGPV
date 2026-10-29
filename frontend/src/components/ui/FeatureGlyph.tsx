import type { FeatureGlyphName } from '../../content/site'

type FeatureGlyphProps = {
  name: FeatureGlyphName
  className?: string
}

export function FeatureGlyph({ name, className = '' }: FeatureGlyphProps) {
  return (
    <svg
      className={`feature-glyph ${className}`.trim()}
      viewBox="0 0 140 120"
      fill="none"
      aria-hidden="true"
    >
      {name === 'ports' && (
        <g stroke="currentColor" strokeWidth="1">
          <circle cx="70" cy="58" r="45" opacity=".22" />
          <circle cx="70" cy="58" r="30" opacity=".14" />
          <path d="M70 13v90M25 58h90" opacity=".12" />
          {Array.from({ length: 4 }).flatMap((_, row) =>
            Array.from({ length: 6 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={28 + col * 17}
                cy={23 + row * 18}
                r="1.6"
                fill="currentColor"
                stroke="none"
                opacity=".35"
              />
            )),
          )}
          <circle cx="96" cy="35" r="7" fill="currentColor" />
          <circle cx="96" cy="35" r="14" opacity=".45" />
          <path d="M96 35 70 58" strokeDasharray="2 4" opacity=".6" />
          <circle cx="52" cy="76" r="4" stroke="currentColor" fill="none" />
        </g>
      )}

      {name === 'server' && (
        <g stroke="currentColor" strokeWidth="1">
          <rect x="32" y="18" width="76" height="20" />
          <rect x="32" y="44" width="76" height="20" opacity=".7" />
          <rect x="32" y="70" width="76" height="20" opacity=".45" />
          <path d="M40 28h18M40 54h18M40 80h18" opacity=".6" />
          <circle cx="98" cy="28" r="2" fill="currentColor" stroke="none" />
          <circle cx="98" cy="54" r="2" fill="currentColor" stroke="none" opacity=".6" />
          <circle cx="98" cy="80" r="2" fill="currentColor" stroke="none" opacity=".35" />
          <path d="M18 100 122 12" opacity=".3" strokeDasharray="3 5" />
        </g>
      )}

      {name === 'web' && (
        <g stroke="currentColor" strokeWidth="1">
          <rect x="22" y="22" width="96" height="72" />
          <path d="M22 36h96" />
          <circle cx="30" cy="29" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="37" cy="29" r="1.5" fill="currentColor" stroke="none" opacity=".6" />
          <circle cx="44" cy="29" r="1.5" fill="currentColor" stroke="none" opacity=".35" />
          <circle cx="70" cy="64" r="17" opacity=".5" />
          <path d="M70 40v48M46 64h48" opacity=".32" />
          <circle cx="70" cy="64" r="3" fill="currentColor" stroke="none" />
        </g>
      )}

      {name === 'ai' && (
        <g stroke="currentColor" strokeWidth="1">
          <path d="M18 30h30M18 40h22M18 50h28M18 60h16" opacity=".35" />
          <path d="M18 74h26M18 84h34M18 94h20" opacity=".2" />
          <path d="M61 60h16M71 55l6 5-6 5" opacity=".7" />
          <rect x="84" y="24" width="38" height="12" opacity=".3" />
          <rect x="84" y="44" width="38" height="6" />
          <rect x="84" y="56" width="30" height="6" opacity=".7" />
          <rect x="84" y="68" width="38" height="6" opacity=".45" />
          <rect x="84" y="80" width="22" height="6" opacity=".25" />
          <circle cx="70" cy="60" r="3" fill="currentColor" stroke="none" />
        </g>
      )}

      {name === 'score' && (
        <g stroke="currentColor" strokeWidth="1">
          <circle cx="70" cy="60" r="42" opacity=".18" />
          <path
            d="M70 18a42 42 0 1 1-40 54"
            strokeWidth="2"
          />
          <path d="M70 18a42 42 0 0 1 38 25" opacity=".55" />
          <path d="M70 30v6M70 84v6M40 60h-6M106 60h-6" opacity=".5" />
          <path d="M70 60 91 43" />
          <circle cx="70" cy="60" r="3" fill="currentColor" stroke="none" />
          <circle cx="91" cy="43" r="2" fill="currentColor" stroke="none" />
        </g>
      )}

      {name === 'history' && (
        <g stroke="currentColor" strokeWidth="1">
          <path d="M42 20v82" opacity=".3" />
          <circle cx="42" cy="32" r="3" fill="currentColor" stroke="none" />
          <circle cx="42" cy="60" r="3" fill="currentColor" stroke="none" opacity=".6" />
          <circle cx="42" cy="88" r="3" fill="currentColor" stroke="none" opacity=".3" />
          <path d="M54 32h54M54 60h40M54 88h48" opacity=".6" />
          <path d="M54 42h30M54 50h18" opacity=".22" />
          <path d="M54 70h24M54 78h34" opacity=".22" />
          <path d="M54 98h20M54 106h31" opacity=".22" />
        </g>
      )}

      {name === 'report' && (
        <g stroke="currentColor" strokeWidth="1">
          <path d="M35 16h48l20 20v68H35V16Z" opacity=".45" />
          <path d="M83 16v20h20" opacity=".6" />
          <path d="M48 48h38M48 58h30M48 68h38M48 78h22" opacity=".35" />
          <path d="M88 70v30M78 90l10 10 10-10" />
          <path d="M73 104h32" opacity=".6" />
        </g>
      )}
    </svg>
  )
}
