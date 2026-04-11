import './App.css'
import { Logo } from './components/Logo'

const RAW_CODE = `import type { HealthAnnotation, DeltaContext } from "../types.js";
import { extractStructure } from "./structure.js";
import { fingerprintFile } from "./fingerprint.js";
import { annotateIR } from "./health.js";
import { astWalkIR } from "./ast-walker.js";

export async function generateL1(
  code: string,
  filePath: string,
  health: HealthAnnotation | null
): Promise<string> {
  const ir = await astWalkIR(code, filePath)
    ?? fingerprintFile(code, 0.75);
  if (health) {
    return annotateIR(ir, health);
  }
  return ir;
}

export function generateLayer(
  layer: IRLayer,
  options: { code: string; filePath: string; ... }
): Promise<string> {
  switch (layer) {
    case "L0":
      return generateL0(options.code, options.filePath);
    case "L1":
      return generateL1(options.code, options.filePath, options.health);
    case "L2":
      if (!options.delta)
        return generateL1(options.code, options.filePath, options.health);
      return generateL2(options.delta, options.health);
    case "L3":
      return options.code;
  }
}`

const IR_CODE = `USE:[../types.js, ./structure.js, ./fingerprint.js, ./health.js, ./ast-walker.js]
OUT ASYNC FN:generateL1(code, filePath, health)
    IF:health \u2192 RET annotateIR(ir, health)
    RET ir
OUT ASYNC FN:generateLayer(layer, options)
    SWITCH:layer
        CASE:"L0" \u2192 RET generateL0(...)
        CASE:"L1" \u2192 RET generateL1(...)
        CASE:"L2" \u2192 RET generateL2(...)
        CASE:"L3" \u2192 RET options.code`

function App() {
  return (
    <>
      {/* Hero */}
      <section id="hero">
        <div className="hero-logo">
          <Logo size={170} />
        </div>
        <span className="badge">v0.1.2 — AST-First Engine</span>
        <h1>Send meaning to your LLM,<br />not code</h1>
        <p className="subtitle">
          89% fewer tokens. Same understanding. Composto parses your code into an AST,
          keeps the signal, drops the noise.
        </p>
        <div className="cta-group">
          <a href="https://github.com/mertcanaltin/composto" className="btn btn-primary" target="_blank">
            GitHub
          </a>
          <a href="#commands" className="btn btn-secondary">
            npm install -g composto-ai
          </a>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Stats */}
      <section id="stats">
        <div className="stat">
          <div className="stat-value">89%</div>
          <div className="stat-label">Token Savings</div>
        </div>
        <div className="stat">
          <div className="stat-value">97%</div>
          <div className="stat-label">Comprehension Preserved</div>
        </div>
        <div className="stat">
          <div className="stat-value">51/51</div>
          <div className="stat-label">Files on AST Engine</div>
        </div>
        <div className="stat">
          <div className="stat-value">145</div>
          <div className="stat-label">Tests Passing</div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Before/After Comparison */}
      <section id="comparison">
        <div className="code-panel">
          <div className="panel-header">
            <h3>Without Composto</h3>
            <span className="token-badge high">765 tokens</span>
          </div>
          <pre>{RAW_CODE}</pre>
        </div>
        <div className="code-panel">
          <div className="panel-header">
            <h3>With Composto</h3>
            <span className="token-badge low">249 tokens — 67% saved</span>
          </div>
          <pre>{IR_CODE}</pre>
        </div>
      </section>

      <div className="ticks"></div>

      {/* How It Works */}
      <section id="how">
        <h2>How it works</h2>
        <p>Tree-sitter parses your code into an AST. Every node gets classified.</p>
        <div className="tier-grid">
          <div className="tier-card">
            <span className="tier-tag keep">Tier 1 — Keep</span>
            <span className="tier-percent">0.8%</span>
            <p className="tier-desc">Imports, functions, classes, interfaces, types, enums</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag summarize">Tier 2 — Summarize</span>
            <span className="tier-percent">0.9%</span>
            <p className="tier-desc">if, for, while, switch, return, throw, try/catch</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag compress">Tier 3 — Compress</span>
            <span className="tier-percent">6.9%</span>
            <p className="tier-desc">Variable declarations, await expressions</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag drop">Tier 4 — Drop</span>
            <span className="tier-percent">86.6%</span>
            <p className="tier-desc">String contents, operators, punctuation, comments. Noise.</p>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Quality Proof */}
      <section id="proof">
        <h2 style={{ textAlign: 'center' }}>Quality proof</h2>
        <p style={{ textAlign: 'center', marginBottom: 8 }}>Same question, raw code vs IR: "What does this file do?"</p>
        <table className="proof-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Complexity</th>
              <th>Raw</th>
              <th>Savings</th>
              <th>Comprehension</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>hotspot.ts</code></td>
              <td>Simple</td>
              <td>299 tokens</td>
              <td>74.2%</td>
              <td>Full</td>
            </tr>
            <tr>
              <td><code>layers.ts</code></td>
              <td>Medium</td>
              <td>765 tokens</td>
              <td>67.5%</td>
              <td>Full</td>
            </tr>
            <tr>
              <td><code>detector.ts</code></td>
              <td>Medium</td>
              <td>704 tokens</td>
              <td>77.3%</td>
              <td>Full</td>
            </tr>
            <tr>
              <td><code>ast-walker.ts</code></td>
              <td>Hard (448 lines)</td>
              <td>3,782 tokens</td>
              <td>82.5%</td>
              <td>~90%</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="ticks"></div>

      {/* Commands */}
      <section id="commands">
        <h2>Get started</h2>
        <p style={{ marginBottom: 24 }}>One install, instant results.</p>
        <pre>{`# Install globally
npm install -g composto-ai

# See how much you save
composto benchmark .

# Generate IR for any file
composto ir src/app.ts

# Smart context within a token budget
composto context src/ --budget 2000

# Scan for security issues
composto scan .

# Analyze codebase health
composto trends .`}</pre>
      </section>

      <div className="ticks"></div>

      {/* Footer */}
      <section id="footer">
        <span>Composto — less tokens, more insight</span>
        <div className="footer-links">
          <a href="https://github.com/mertcanaltin/composto" target="_blank">GitHub</a>
          <a href="https://www.npmjs.com/package/composto-ai" target="_blank">npm</a>
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/benchmark-proof.md" target="_blank">Benchmark</a>
        </div>
      </section>
    </>
  )
}

export default App
