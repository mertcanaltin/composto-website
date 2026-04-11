export function Logo({ size = 170 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central node — the AST root */}
      <circle cx="100" cy="100" r="24" fill="var(--accent)" opacity="0.9" />
      <text x="100" y="106" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600" fontFamily="var(--mono)">IR</text>

      {/* Tier 1 — Keep (green) — top nodes */}
      <circle cx="100" cy="30" r="12" fill="var(--accent)" opacity="0.7" />
      <line x1="100" y1="42" x2="100" y2="76" stroke="var(--accent)" strokeWidth="2" opacity="0.4" />

      <circle cx="45" cy="55" r="10" fill="var(--accent)" opacity="0.6" />
      <line x1="55" y1="60" x2="82" y2="85" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />

      <circle cx="155" cy="55" r="10" fill="var(--accent)" opacity="0.6" />
      <line x1="145" y1="60" x2="118" y2="85" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />

      {/* Tier 2 — Summarize (blue) — mid nodes */}
      <circle cx="50" cy="120" r="8" fill="#3b82f6" opacity="0.6" />
      <line x1="58" y1="116" x2="80" y2="108" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3" />

      <circle cx="150" cy="120" r="8" fill="#3b82f6" opacity="0.6" />
      <line x1="142" y1="116" x2="120" y2="108" stroke="#3b82f6" strokeWidth="1.5" opacity="0.3" />

      {/* Tier 3 — Compress (amber) — lower nodes */}
      <circle cx="70" cy="160" r="6" fill="#f59e0b" opacity="0.5" />
      <line x1="74" y1="155" x2="90" y2="122" stroke="#f59e0b" strokeWidth="1" opacity="0.25" />

      <circle cx="130" cy="160" r="6" fill="#f59e0b" opacity="0.5" />
      <line x1="126" y1="155" x2="110" y2="122" stroke="#f59e0b" strokeWidth="1" opacity="0.25" />

      {/* Tier 4 — Drop (red, fading) — scattered dots */}
      <circle cx="25" cy="90" r="3" fill="var(--red)" opacity="0.2" />
      <circle cx="175" cy="90" r="3" fill="var(--red)" opacity="0.2" />
      <circle cx="30" cy="150" r="2.5" fill="var(--red)" opacity="0.15" />
      <circle cx="170" cy="150" r="2.5" fill="var(--red)" opacity="0.15" />
      <circle cx="100" cy="185" r="2" fill="var(--red)" opacity="0.1" />
      <circle cx="40" cy="180" r="2" fill="var(--red)" opacity="0.1" />
      <circle cx="160" cy="180" r="2" fill="var(--red)" opacity="0.1" />
      <circle cx="15" cy="130" r="2" fill="var(--red)" opacity="0.12" />
      <circle cx="185" cy="130" r="2" fill="var(--red)" opacity="0.12" />

      {/* Glow effect on center */}
      <circle cx="100" cy="100" r="40" fill="var(--accent)" opacity="0.06" />
      <circle cx="100" cy="100" r="60" fill="var(--accent)" opacity="0.03" />
    </svg>
  )
}

export function LogoSmall() {
  return (
    <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="28" fill="var(--accent)" opacity="0.9" />
      <text x="100" y="108" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="var(--mono)">IR</text>
      <circle cx="100" cy="30" r="12" fill="var(--accent)" opacity="0.5" />
      <circle cx="45" cy="60" r="10" fill="var(--accent)" opacity="0.4" />
      <circle cx="155" cy="60" r="10" fill="var(--accent)" opacity="0.4" />
      <line x1="100" y1="42" x2="100" y2="72" stroke="var(--accent)" strokeWidth="3" opacity="0.3" />
      <line x1="55" y1="65" x2="80" y2="85" stroke="var(--accent)" strokeWidth="2" opacity="0.2" />
      <line x1="145" y1="65" x2="120" y2="85" stroke="var(--accent)" strokeWidth="2" opacity="0.2" />
    </svg>
  )
}
