import './App.css'
import { Logo } from './components/Logo'
import { CodeBlock } from './components/CodeBlock'

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
        <Logo />
        <span className="badge">v0.1.2 — AST-First Engine</span>
        <p className="hero-tagline">Send meaning to your LLM, not code</p>
        <p className="subtitle">
          89% fewer tokens. Same understanding. Composto parses your code into an AST,
          keeps the signal, drops the noise.
        </p>
        <div className="cta-group">
          <a href="https://github.com/mertcanaltin/composto" className="btn btn-primary" target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="#commands" className="btn btn-secondary btn-install">
            <code className="install-code">npm i -g composto-ai</code>
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
          <div className="stat-value">5</div>
          <div className="stat-label">Languages Supported</div>
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
          <CodeBlock code={RAW_CODE} language="typescript" />
        </div>
        <div className="code-panel">
          <div className="panel-header">
            <h3>With Composto</h3>
            <span className="token-badge low">249 tokens — 67% saved</span>
          </div>
          <CodeBlock code={IR_CODE} language="ir" />
        </div>
      </section>

      <div className="ticks"></div>

      {/* Use Cases */}
      <section id="use-cases">
        <h2>How people use it</h2>
        <p style={{ textAlign: 'center', marginBottom: 32 }}>Real workflows, real savings.</p>
        <div className="use-case-grid">
          <div className="use-case">
            <span className="use-case-num">01</span>
            <h3>"Explain this codebase"</h3>
            <p className="use-case-desc">You have 200 files. Your LLM has a 200K token window. Raw code won't fit. With Composto:</p>
            <CodeBlock language="bash" code={`# Pack 200 files into 4000 tokens
composto context src/ --budget 4000

# Result: 45 files at L1 (detailed)
#         155 files at L0 (structure)
#         Budget: 3,987/4,000 tokens`} />
            <p className="use-case-result">Your LLM sees the entire codebase architecture in one prompt.</p>
          </div>

          <div className="use-case">
            <span className="use-case-num">02</span>
            <h3>"Review this PR"</h3>
            <p className="use-case-desc">You changed 3 files but the reviewer needs context from 10 surrounding files:</p>
            <CodeBlock language="bash" code={`# Changed files: full detail
composto ir src/auth/login.ts L1

# Context files: compressed
composto ir src/auth/session.ts L1
composto ir src/types.ts L0

# 10 files of context in 800 tokens
# instead of 8,000`} />
            <p className="use-case-result">10x more context in the same token budget. Better reviews.</p>
          </div>

          <div className="use-case">
            <span className="use-case-num">03</span>
            <h3>"Is Composto worth it for my project?"</h3>
            <p className="use-case-desc">Run the benchmark on your own codebase. Takes 2 seconds:</p>
            <CodeBlock language="bash" code={`composto benchmark .

# File                         Raw    L1   Saved
# auth/login.ts                842   156   81.5%
# utils/helpers.ts              480    72   85.0%
# api/routes.ts               1203   198   83.5%
# TOTAL                       2525   426   83.1%`} />
            <p className="use-case-result">Instant proof. No API key needed. Pure local analysis.</p>
          </div>
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
        <div className="proof-table-wrapper">
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
        </div>
      </section>

      <div className="ticks"></div>

      {/* Commands */}
      <section id="commands">
        <h2>Get started</h2>
        <p style={{ marginBottom: 24 }}>CLI tool. Works with any project.</p>
        <CodeBlock language="bash" code={`# Install
npm install -g composto-ai

# See how much you save
composto benchmark .

# Generate IR for any file
composto ir src/app.ts

# Smart context within a token budget
composto context src/ --budget 2000

# Scan for security issues
composto scan .`} />
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
