import { useState } from 'react'
import { CodeBlock } from './CodeBlock'
import './LiveDemo.css'

const DEFAULT_CODE = `import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export interface Config {
  port: number;
  host: string;
  debug: boolean;
}

export async function loadConfig(path: string): Promise<Config> {
  const raw = readFileSync(resolve(path), "utf-8");
  const parsed = JSON.parse(raw);

  if (!parsed.port || typeof parsed.port !== "number") {
    throw new Error("Invalid port");
  }

  return {
    port: parsed.port,
    host: parsed.host ?? "localhost",
    debug: parsed.debug ?? false,
  };
}

export function mergeConfig(base: Config, overrides: Partial<Config>): Config {
  return { ...base, ...overrides };
}`

// Simple client-side IR simulation (mirrors AST walker logic)
function generateIR(code: string): { ir: string; rawTokens: number; irTokens: number } {
  const lines = code.split('\n')
  const irLines: string[] = []
  const rawTokens = code.split(/[\s]+|(?<=[{}()[\];,.:=<>!&|?+\-*/])|(?=[{}()[\];,.:=<>!&|?+\-*/])/).filter(Boolean).length

  for (const line of lines) {
    const t = line.trim()
    if (!t || t === '{' || t === '}' || t === '});' || t === ');') continue
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) continue

    // Imports
    if (/^import\s/.test(t)) {
      const m = t.match(/from\s+["']([^"']+)["']/)
      irLines.push(m ? `USE:${m[1]}` : `USE:${t.slice(0, 50)}`)
      continue
    }
    // Export function
    if (/^export\s+(async\s+)?function\s+(\w+)/.test(t)) {
      const m = t.match(/^export\s+(async\s+)?function\s+(\w+)\s*\(([^)]*)\)/)
      if (m) {
        const async_ = m[1] ? 'ASYNC ' : ''
        irLines.push(`OUT ${async_}FN:${m[2]}(${m[3].replace(/\s+/g, ' ').trim()})`)
      }
      continue
    }
    // Function
    if (/^(async\s+)?function\s+(\w+)/.test(t)) {
      const m = t.match(/^(async\s+)?function\s+(\w+)\s*\(([^)]*)\)/)
      if (m) {
        const async_ = m[1] ? 'ASYNC ' : ''
        irLines.push(`${async_}FN:${m[2]}(${m[3].replace(/\s+/g, ' ').trim()})`)
      }
      continue
    }
    // Export class
    if (/^export\s+class\s+(\w+)/.test(t)) {
      const m = t.match(/^export\s+class\s+(\w+)/)
      irLines.push(`OUT CLASS:${m![1]}`)
      continue
    }
    // Export interface
    if (/^export\s+interface\s+(\w+)/.test(t)) {
      const m = t.match(/^export\s+interface\s+(\w+)/)
      irLines.push(`OUT INTERFACE:${m![1]}`)
      continue
    }
    // Export type
    if (/^export\s+type\s+(\w+)/.test(t)) {
      const m = t.match(/^export\s+type\s+(\w+)/)
      irLines.push(`OUT TYPE:${m![1]}`)
      continue
    }
    // Interface
    if (/^interface\s+(\w+)/.test(t)) {
      const m = t.match(/^interface\s+(\w+)/)
      irLines.push(`INTERFACE:${m![1]}`)
      continue
    }
    // If with return
    if (/^if\s*\(([^)]+)\)\s*\{?\s*$/.test(t)) {
      const m = t.match(/^if\s*\(([^)]+)\)/)
      const cond = m![1].length > 50 ? m![1].slice(0, 47) + '...' : m![1]
      irLines.push(`  IF:${cond}`)
      continue
    }
    // Return
    if (/^return\s/.test(t)) {
      const val = t.replace(/^return\s+/, '').replace(/;$/, '')
      const short = val.length > 50 ? val.slice(0, 47) + '...' : val
      irLines.push(`  RET ${short}`)
      continue
    }
    // Throw
    if (/^throw\s/.test(t)) {
      const val = t.replace(/^throw\s+/, '').replace(/;$/, '')
      irLines.push(`  THROW:${val.length > 40 ? val.slice(0, 37) + '...' : val}`)
      continue
    }
    // For/for-of
    if (/^for\s*\(/.test(t)) {
      irLines.push(`  LOOP`)
      continue
    }
    // Switch
    if (/^switch\s*\(/.test(t)) {
      const m = t.match(/^switch\s*\(([^)]+)\)/)
      irLines.push(`  SWITCH:${m ? m[1] : '...'}`)
      continue
    }
    // Case
    if (/^case\s/.test(t)) {
      irLines.push(`    CASE:${t.replace(/^case\s+/, '').replace(/:$/, '')}`)
      continue
    }
    // Try/catch
    if (t === 'try {' || t === 'try{') { irLines.push(`  TRY`); continue }
    if (/^catch/.test(t)) { irLines.push(`  CATCH`); continue }
    // Skip everything else (Tier 4)
  }

  const ir = irLines.join('\n')
  const irTokens = ir.split(/[\s]+|(?<=[{}()[\];,.:=<>!&|?+\-*/])|(?=[{}()[\];,.:=<>!&|?+\-*/])/).filter(Boolean).length

  return { ir, rawTokens, irTokens }
}

export function LiveDemo() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const { ir, rawTokens, irTokens } = generateIR(code)
  const saved = rawTokens > 0 ? ((rawTokens - irTokens) / rawTokens * 100).toFixed(1) : '0'

  return (
    <section id="demo">
      <h2>Try it yourself</h2>
      <p style={{ textAlign: 'center', marginBottom: 24 }}>Paste your code. See what your LLM actually needs.</p>
      <div className="demo-grid">
        <div className="demo-panel">
          <div className="demo-header">
            <h3>Your code</h3>
            <span className="token-badge high">{rawTokens} tokens</span>
          </div>
          <textarea
            className="demo-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="demo-panel">
          <div className="demo-header">
            <h3>Composto IR</h3>
            <span className="token-badge low">{irTokens} tokens, {saved}% saved</span>
          </div>
          <CodeBlock code={ir || '// paste code on the left'} language="ir" />
        </div>
      </div>
    </section>
  )
}
