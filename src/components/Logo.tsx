export function Logo({ size = 170 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central node */}
      <circle cx="100" cy="100" r="24" fill="#0f172a" />
      <text x="100" y="106" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600" fontFamily="var(--mono)">IR</text>

      {/* Tier 1 — Keep (dark) */}
      <circle cx="100" cy="30" r="12" fill="#0f172a" opacity="0.8" />
      <line x1="100" y1="42" x2="100" y2="76" stroke="#0f172a" strokeWidth="2" opacity="0.15" />
      <circle cx="45" cy="55" r="10" fill="#0f172a" opacity="0.6" />
      <line x1="55" y1="60" x2="82" y2="85" stroke="#0f172a" strokeWidth="1.5" opacity="0.12" />
      <circle cx="155" cy="55" r="10" fill="#0f172a" opacity="0.6" />
      <line x1="145" y1="60" x2="118" y2="85" stroke="#0f172a" strokeWidth="1.5" opacity="0.12" />

      {/* Tier 2 — Summarize (blue) */}
      <circle cx="50" cy="120" r="8" fill="#2563eb" opacity="0.5" />
      <line x1="58" y1="116" x2="80" y2="108" stroke="#2563eb" strokeWidth="1.5" opacity="0.15" />
      <circle cx="150" cy="120" r="8" fill="#2563eb" opacity="0.5" />
      <line x1="142" y1="116" x2="120" y2="108" stroke="#2563eb" strokeWidth="1.5" opacity="0.15" />

      {/* Tier 3 — Compress (amber) */}
      <circle cx="70" cy="160" r="6" fill="#d97706" opacity="0.4" />
      <line x1="74" y1="155" x2="90" y2="122" stroke="#d97706" strokeWidth="1" opacity="0.1" />
      <circle cx="130" cy="160" r="6" fill="#d97706" opacity="0.4" />
      <line x1="126" y1="155" x2="110" y2="122" stroke="#d97706" strokeWidth="1" opacity="0.1" />

      {/* Tier 4 — Drop (red, fading) */}
      <circle cx="25" cy="90" r="3" fill="#dc2626" opacity="0.15" />
      <circle cx="175" cy="90" r="3" fill="#dc2626" opacity="0.15" />
      <circle cx="30" cy="150" r="2.5" fill="#dc2626" opacity="0.1" />
      <circle cx="170" cy="150" r="2.5" fill="#dc2626" opacity="0.1" />
      <circle cx="100" cy="185" r="2" fill="#dc2626" opacity="0.08" />
      <circle cx="40" cy="180" r="2" fill="#dc2626" opacity="0.08" />
      <circle cx="160" cy="180" r="2" fill="#dc2626" opacity="0.08" />

      {/* Subtle glow */}
      <circle cx="100" cy="100" r="40" fill="#0f172a" opacity="0.03" />
      <circle cx="100" cy="100" r="60" fill="#0f172a" opacity="0.015" />
    </svg>
  )
}
