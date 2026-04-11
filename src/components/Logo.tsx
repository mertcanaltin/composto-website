import './Logo.css'

const KEPT_TOKENS = ['FN:', 'USE:', 'RET', 'IF:', 'CLASS:', 'OUT', 'ASYNC', 'LOOP', 'SWITCH:']
const DROPPED_TOKENS = ['{ }', '( )', '; ;', '""', '===', '&&', '||', '=> {', 'const', '...', '  ', '\\n', '0.3', '/**/', '} }']

export function Logo() {
  return (
    <div className="glitch-wrapper">
      <div className="token-rain">
        {DROPPED_TOKENS.map((t, i) => (
          <span key={`d${i}`} className="token dropped" style={{
            left: `${5 + (i * 7) % 90}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}>{t}</span>
        ))}
        {KEPT_TOKENS.map((t, i) => (
          <span key={`k${i}`} className="token kept" style={{
            left: `${10 + (i * 11) % 80}%`,
            animationDelay: `${i * 0.5 + 0.2}s`,
            animationDuration: `${4 + (i % 2)}s`,
          }}>{t}</span>
        ))}
      </div>
      <h1 className="glitch" data-text="COMPOSTO">COMPOSTO</h1>
    </div>
  )
}
