import { useState, useRef, useEffect } from 'react'
import { CodeBlock } from './CodeBlock'
import './CodeSlider.css'

interface Props {
  rawCode: string
  irCode: string
  rawTokens: number
  irTokens: number
  savings: string
}

export function CodeSlider({ rawCode, irCode, rawTokens, irTokens, savings }: Props) {
  const [position, setPosition] = useState(95)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const animated = useRef(false)

  useEffect(() => {
    if (animated.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        // Animate from 95 (raw) to 5 (IR)
        let start: number | null = null
        function step(ts: number) {
          if (!start) start = ts
          const progress = Math.min((ts - start) / 1500, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setPosition(95 - eased * 90)
          if (progress < 1) requestAnimationFrame(step)
        }
        setTimeout(() => requestAnimationFrame(step), 400)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  function updatePosition(clientX: number) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(pct)
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    updatePosition(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }

  function onPointerUp() {
    dragging.current = false
  }

  const isMoreRaw = position > 50
  const isMoreIR = position < 50

  return (
    <div className="slider-section">
      <div className="slider-labels">
        <div className={`slider-label ${isMoreRaw ? 'active' : ''}`}>
          <span>Without Composto</span>
          <span className="token-badge high">{rawTokens} tokens</span>
        </div>
        <div className={`slider-label right ${isMoreIR ? 'active' : ''}`}>
          <span>With Composto</span>
          <span className="token-badge low">{irTokens} tokens, {savings} saved</span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="slider-container"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Raw code layer (full width, clipped) */}
        <div className="slider-layer raw-layer" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <CodeBlock code={rawCode} language="typescript" />
        </div>

        {/* IR code layer (full width, clipped) */}
        <div className="slider-layer ir-layer" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <CodeBlock code={irCode} language="ir" />
        </div>

        {/* Slider handle */}
        <div className="slider-handle" style={{ left: `${position}%` }}>
          <div className="slider-line" />
          <div className="slider-grip">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#da7756" />
              <path d="M7 7L4 10L7 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 7L16 10L13 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
