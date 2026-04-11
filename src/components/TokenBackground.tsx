import { useEffect, useState } from 'react'
import './TokenBackground.css'

const KEPT = ['FN:', 'USE:', 'RET', 'IF:', 'CLASS:', 'OUT', 'ASYNC', 'LOOP', 'SWITCH:', 'TYPE:', 'ENUM:', 'INTERFACE:', 'AWAIT:', 'TRY', 'CATCH:']
const DROPPED = ['{ }', '( )', '; ;', '""', '===', '&&', '||', '=> {', 'const ', '...', '\\n', '/**/', '} }', '=> ', '</', '/>', '++;', 'null', 'void', '  ', '0.3', 'true', '});', '],', '?.']

interface Token {
  id: number
  text: string
  kept: boolean
  x: number
  y: number
  direction: 'left' | 'right'
  speed: number
  delay: number
}

let nextId = 0

function createToken(): Token {
  const kept = Math.random() < 0.3
  const pool = kept ? KEPT : DROPPED
  const direction = Math.random() < 0.5 ? 'left' : 'right'
  return {
    id: nextId++,
    text: pool[Math.floor(Math.random() * pool.length)],
    kept,
    x: direction === 'left' ? -10 : 110,
    y: 5 + Math.random() * 90,
    direction,
    speed: 8 + Math.random() * 15,
    delay: 0,
  }
}

export function TokenBackground() {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    // Initial batch
    const initial: Token[] = []
    for (let i = 0; i < 12; i++) {
      const t = createToken()
      t.delay = i * 1.5
      initial.push(t)
    }
    setTokens(initial)

    // Spawn new tokens periodically
    const interval = setInterval(() => {
      setTokens(prev => {
        const filtered = prev.length > 30 ? prev.slice(-25) : prev
        return [...filtered, createToken()]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="token-bg" aria-hidden="true">
      {tokens.map(t => (
        <span
          key={t.id}
          className={`bg-token ${t.kept ? 'bg-kept' : 'bg-dropped'} bg-${t.direction}`}
          style={{
            top: `${t.y}%`,
            animationDuration: `${t.speed}s`,
            animationDelay: `${t.delay}s`,
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  )
}
