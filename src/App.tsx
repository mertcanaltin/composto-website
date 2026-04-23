import { Link } from 'react-router-dom'
import './App.css'
import { Logo } from './components/Logo'
import { CodeBlock } from './components/CodeBlock'
import { CodeSlider } from './components/CodeSlider'
// TokenBackground removed
import { LiveDemo } from './components/LiveDemo'

const RAW_CODE = `import Fastify from "fastify";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = Fastify({ logger: true });

app.post("/api/auth/login", async (request, reply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.code(400).send({ error: "Missing fields" });
  }

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    return reply.code(401).send({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return reply.code(401).send({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return reply.send({ token, user: { id: user.id, email: user.email } });
});

app.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});`

const IR_CODE = `USE:fastify
USE:pg
USE:jsonwebtoken
USE:bcrypt
FN:app.post("/api/auth/login") =>
    IF:!email || !password \u2192 RET reply.code(400)
    AWAIT:result = pool.query("SELECT * FROM users...")
    IF:!user \u2192 RET reply.code(401)
    AWAIT:valid = bcrypt.compare(password, user.password_hash)
    IF:!valid \u2192 RET reply.code(401)
    RET reply.send({ token, user })`

function App() {
  return (
    <>
      {/* Hero */}
      <section id="hero">
        <Logo />
        <span className="badge">v0.6.0 | Hook-enforced</span>
        <p className="hero-tagline">Causal memory layer for coding agents</p>
        <p className="subtitle">
          Your agent gets repo history context before every Edit, Write, or MultiEdit.
          Hook-enforced on Claude Code, Cursor, and Gemini CLI. Local-first, MIT.
        </p>
        <div className="cta-group">
          <a href="https://github.com/mertcanaltin/composto" className="btn btn-primary" target="_blank">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="#commands" className="btn btn-secondary btn-install">
            <code className="install-code">npm i -g composto-ai</code>
          </a>
          <Link to="/docs" className="btn btn-secondary">
            Docs
          </Link>
        </div>
        <div style={{ marginTop: 48, maxWidth: 1100, width: '100%' }}>
          <img
            src="/banners/composto_hero_banner_v3.svg"
            alt="Catches the bug your agent is about to reintroduce. composto init --client=claude-code"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
        </div>
      </section>

      <div className="ticks"></div>

      {/* Stats */}
      <section id="stats">
        <div className="stat">
          <div className="stat-value">89.5%</div>
          <div className="stat-label">Avg Token Savings (52 files)</div>
        </div>
        <div className="stat">
          <div className="stat-value">10x</div>
          <div className="stat-label">More Code Fits in Context</div>
        </div>
        <div className="stat">
          <div className="stat-value">99.1%</div>
          <div className="stat-label">Best Case Compression</div>
        </div>
        <div className="stat">
          <div className="stat-value">60.3%</div>
          <div className="stat-label">Worst Case (still saves)</div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Real World Benchmarks */}
      <section id="proof">
        <h2 style={{ textAlign: 'center' }}>Tested on real projects</h2>
        <p style={{ textAlign: 'center', marginBottom: 8 }}>Not our code. Popular open source projects you know.</p>
        <div className="proof-table-wrapper">
        <table className="proof-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Files</th>
              <th>Raw Tokens</th>
              <th>Savings</th>
              <th>AST Engine</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Fastify</strong></td>
              <td>31</td>
              <td>47,539</td>
              <td>88.0%</td>
              <td>28/31</td>
            </tr>
            <tr>
              <td><strong>Undici</strong></td>
              <td>113</td>
              <td>233,876</td>
              <td>88.5%</td>
              <td>105/113</td>
            </tr>
            <tr>
              <td><strong>Node.js</strong></td>
              <td>361</td>
              <td>946,376</td>
              <td>86.5%</td>
              <td>338/361</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text)' }}>
          Run <code>composto benchmark .</code> on your own project. Takes 2 seconds.
        </p>
      </section>

      <div className="ticks"></div>

      {/* Cost Savings */}
      <section id="savings">
        <h2>Real cost savings</h2>
        <p style={{ textAlign: 'center', marginBottom: 24 }}>
          Benchmark: 52 files, 46,634 raw tokens per call. Saving 41,721 tokens each time.
        </p>
        <div className="savings-grid">
          <div className="savings-card">
            <h3>10 calls/day</h3>
            <p className="savings-scenario">Same 52-file project, light usage</p>
            <div className="savings-row">
              <span>Claude Opus</span>
              <span className="savings-amount">$188/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Sonnet</span>
              <span className="savings-amount">$38/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Haiku</span>
              <span className="savings-amount">$3.13/mo</span>
            </div>
          </div>
          <div className="savings-card featured">
            <h3>50 calls/day</h3>
            <p className="savings-scenario">Same 52-file project, active development</p>
            <div className="savings-row">
              <span>Claude Opus</span>
              <span className="savings-amount">$939/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Sonnet</span>
              <span className="savings-amount">$188/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Haiku</span>
              <span className="savings-amount">$16/mo</span>
            </div>
          </div>
          <div className="savings-card">
            <h3>100 calls/day</h3>
            <p className="savings-scenario">Same 52-file project, heavy usage</p>
            <div className="savings-row">
              <span>Claude Opus</span>
              <span className="savings-amount">$1,877/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Sonnet</span>
              <span className="savings-amount">$375/mo</span>
            </div>
            <div className="savings-row">
              <span>Claude Haiku</span>
              <span className="savings-amount">$31/mo</span>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text)' }}>
          All numbers from real benchmark. Same project, same files. Only the call volume changes. Composto is free.
        </p>
      </section>

      <div className="ticks"></div>

      {/* Quality Proof */}
      <section id="quality">
        <h2>Does the LLM lose understanding?</h2>
        <p style={{ textAlign: 'center', marginBottom: 24 }}>
          We asked real questions about real projects using only the IR. Then verified against source code.
        </p>
        <div className="quality-grid">
          <div className="quality-card">
            <div className="quality-header">
              <h3>Fastify reply.js</h3>
              <span className="quality-badge">1,030 lines → 73 IR</span>
            </div>
            <p className="quality-question">"What does this file do and what are the main functions?"</p>
            <p className="quality-answer">
              Identified all 20 functions, correct flow order (Reply → hooks → onSendEnd → stream/trailer → serialize),
              correct payload dispatch logic (null → stream → web stream → buffer → error).
            </p>
            <span className="quality-score">Verified: 100% accurate</span>
          </div>
          <div className="quality-card">
            <div className="quality-header">
              <h3>Node.js net.js</h3>
              <span className="quality-badge">2,569 lines → 192 IR</span>
            </div>
            <p className="quality-question">"What public API does this module expose?"</p>
            <p className="quality-answer">
              Identified createServer, connect, Socket constructor, auto-select family API, all helpers.
              Now captures runtime inheritance: EXTENDS:Socket &lt; stream.Duplex
            </p>
            <span className="quality-score">Verified: 100% accurate</span>
          </div>
          <div className="quality-card">
            <div className="quality-header">
              <h3>Fastify onSendEnd</h3>
              <span className="quality-badge">105-line function</span>
            </div>
            <p className="quality-question">"In what order does it check the payload?"</p>
            <p className="quality-answer">
              Reconstructed all 8 conditions in exact order: trailers → Response → null → 1xx/204 → pipe → getReader → invalid type → finalize.
            </p>
            <span className="quality-score">Verified: 100% accurate</span>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/quality-proof.md" target="_blank">Full methodology and verification</a>
        </p>
      </section>

      <div className="ticks"></div>

      {/* Before/After Slider */}
      <CodeSlider
        rawCode={RAW_CODE}
        irCode={IR_CODE}
        rawTokens={304}
        irTokens={113}
        savings="63%"
      />

      <div className="ticks"></div>

      {/* Target Feature */}
      <section id="target">
        <h2>"But what about fixing bugs?"</h2>
        <p style={{ textAlign: 'center', marginBottom: 24, maxWidth: 640, margin: '0 auto 24px' }}>
          Fair question. IR is for understanding, not implementation. For bug fixes you need exact code.
          That's what <code>--target</code> is for.
        </p>
        <div className="target-demo">
          <div className="target-panel">
            <h3>You ask:</h3>
            <p className="target-quote">"Fix the bug in validateToken. It's returning false for valid tokens."</p>
          </div>
          <div className="target-panel">
            <h3>Composto sends:</h3>
            <CodeBlock language="bash" code={`composto context . --target validateToken

# Target file (contains validateToken): RAW CODE
# Files that import/export it: L1 (compressed)
# Hotspot files: L1 (compressed)
# Everything else: L0 (structure only)

# Result: your LLM sees the exact function code
# PLUS surrounding context, all within budget`} />
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
          Target file at L3, 10x more surrounding context at L1/L0. Same token budget.
        </p>
      </section>

      <div className="ticks"></div>

      {/* BlastRadius — causal oracle */}
      <section id="blastradius">
        <div style={{ maxWidth: 1100, width: '100%', marginBottom: 32 }}>
          <img
            src="/banners/composto_before_after_banner.svg"
            alt="With and without causal memory — same agent, same edit, different outcome."
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
        </div>
        <span className="badge" style={{ marginBottom: 16 }}>New · v0.6.0</span>
        <h2>composto_blastradius</h2>
        <p style={{ textAlign: 'center', marginBottom: 8, maxWidth: 720, margin: '0 auto 8px' }}>
          IR tells your LLM <em>what your code means</em>.{' '}
          <strong>BlastRadius tells it what your code has historically broken.</strong>
        </p>
        <p style={{ textAlign: 'center', marginBottom: 24, maxWidth: 720, margin: '0 auto 24px', fontSize: 14, color: 'var(--text)' }}>
          Before your agent edits a file it can ask: has this region been reverted? is there a fix cluster?
          is the last author still around? Signals your LLM can't infer from current code — the data lives
          in the delta between past states of the repo.
        </p>
        <div className="target-demo">
          <div className="target-panel">
            <h3>You ask:</h3>
            <CodeBlock language="bash" code={`composto index                           # bootstrap the memory graph
composto impact scripts/demo-video.ts   # query blast radius`} />
          </div>
          <div className="target-panel">
            <h3>Composto answers:</h3>
            <CodeBlock language="bash" code={`verdict:    medium
score:      0.52
confidence: 0.50
tazelik:    fresh
signals:
  revert_match       ■■■■■■■■■■ strength=1.00 precision=1.00
  hotspot            ■          strength=0.10 precision=0.54
  fix_ratio          ■          strength=0.07 precision=0.54
  author_churn       ·          strength=0.00 precision=0.16

# This file was touched by a Revert commit in history.
# blastradius remembers. Your LLM couldn't.`} />
          </div>
        </div>

        <div style={{ maxWidth: 1100, width: '100%', margin: '48px auto 0' }}>
          <img
            src="/banners/composto_hook_strategy_wide.svg"
            alt="Hook strategy — agent Edit call flows through PreToolUse hook, Composto queries the local graph, verdict is injected back into agent context."
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
        </div>

        <div style={{ maxWidth: 1100, width: '100%', margin: '48px auto 0' }}>
          <img
            src="/banners/composto_4signal_architecture.svg"
            alt="Four signals — revert_match carries the product; hotspot, fix_ratio, author_churn feed repo-calibrated precision."
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
        </div>

        <div style={{ maxWidth: 1100, width: '100%', margin: '48px auto 0' }}>
          <img
            src="/banners/composto_honest_eval.svg"
            alt="Honest eval — time-travel backtest rewinds the DB to pre-fix HEAD so revert_match can't see the fix."
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
        </div>

        <div className="proof-table-wrapper" style={{ marginTop: 24 }}>
          <table className="proof-table">
            <thead>
              <tr>
                <th>Repo</th>
                <th>Eval</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>Gate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>picomatch</strong></td>
                <td>time-travel, unattributed</td>
                <td>0.65</td>
                <td>0.78</td>
                <td>✅ pass</td>
              </tr>
              <tr>
                <td><strong>composto</strong> <small>(self)</small></td>
                <td>time-travel, unattributed</td>
                <td>0.36</td>
                <td>0.12</td>
                <td>❌ fails on self</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text)' }}>
          Ship gate: <strong>precision &gt; 60%, recall &gt; 40%</strong> on the <code>medium|high</code> verdict band.
          Numbers are from the honest time-travel backtest — the DB is rewound to pre-fix HEAD per event,
          so <code>revert_match</code> can't read the fix that came later.{' '}
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/blastradius-proof-v2.md" target="_blank" rel="noreferrer">
            Read the numbers →
          </a>
          <br />
          <small>
            Value scales with the repo's fix history. picomatch (mature, rich revert history) clears the gate;
            young repos like composto-itself don't. Four signals with repo-calibrated precision; verdict returns{' '}
            <code>"unknown"</code> when confidence is low instead of guessing.
          </small>
        </p>

        <div className="br-getstarted">
          <h3 style={{ textAlign: 'center', marginTop: 40, marginBottom: 20 }}>Try it in 60 seconds</h3>
          <div className="br-steps">
            <div className="br-step">
              <span className="br-step-num">1</span>
              <div>
                <h4>Install</h4>
                <CodeBlock language="bash" code={`npm install -g composto-ai`} />
              </div>
            </div>
            <div className="br-step">
              <span className="br-step-num">2</span>
              <div>
                <h4>One-command setup</h4>
                <CodeBlock language="bash" code={`cd your-project
composto init --client=claude-code     # or cursor, or gemini-cli`} />
                <p style={{ fontSize: 13, color: 'var(--text)', marginTop: 8 }}>
                  Writes MCP config + a <code>PreToolUse</code> hook into your AI client's settings.
                  On every Edit / Write, the agent gets the verdict automatically as in-context
                  guidance. Passthrough on <code>low</code>, no noise.
                </p>
              </div>
            </div>
            <div className="br-step">
              <span className="br-step-num">3</span>
              <div>
                <h4>Observe what happens</h4>
                <CodeBlock language="bash" code={`composto stats            # hook invocations, verdict distribution, p50/p95 latency
composto stats --disable  # local-only opt-out (nothing leaves your machine)

# Or query on-demand, any time:
composto impact src/auth/login.ts`} />
              </div>
            </div>
          </div>
        </div>

        <div className="br-workflows">
          <h3 style={{ textAlign: 'center', marginTop: 40, marginBottom: 12 }}>Where it fits</h3>
          <div className="br-workflow-grid">
            <div className="br-workflow">
              <span className="br-workflow-tag">Hook-enforced (v0.6.0+)</span>
              <p>
                After <code>composto init --client=claude-code</code> (or <code>cursor</code>,{' '}
                <code>gemini-cli</code>), every Edit / Write call goes through a <code>PreToolUse</code>{' '}
                hook. Agent sees the verdict block inline — no "remember to call composto_blastradius."
                p95 round-trip ≈100ms warm.
              </p>
            </div>
            <div className="br-workflow">
              <span className="br-workflow-tag">On your machine</span>
              <p>
                Run <code>composto impact</code> when you're about to touch a file you don't know well.
                The verdict plus the evidence list (commit SHAs that broke things) points you at the
                past incidents you'd miss by reading the current code.
              </p>
            </div>
            <div className="br-workflow">
              <span className="br-workflow-tag">In CI / pre-merge</span>
              <p>
                Pipe <code>git diff --name-only origin/main</code> into <code>composto impact</code>.
                Flag PRs that touch medium|high-verdict files so a human gets a second look before
                merging.
              </p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text)' }}>
          <strong>When NOT to use it:</strong> fresh repos with less than ~50 commits — confidence stays low on purpose.
          The tool honestly returns <code>unknown</code> rather than guess. Value grows with the repo's history.
        </p>

        <div style={{ maxWidth: 1100, width: '100%', margin: '48px auto 0' }}>
          <img
            src="/banners/composto_repo_local_privacy.svg"
            alt="Repo-local privacy — the graph stays in your repo. No cloud, no telemetry, no account."
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          />
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
            <span className="tier-tag keep">Tier 1: Keep</span>
            <span className="tier-percent">0.8%</span>
            <p className="tier-desc">Imports, functions, classes, interfaces, types, enums</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag summarize">Tier 2: Summarize</span>
            <span className="tier-percent">0.9%</span>
            <p className="tier-desc">if, for, while, switch, return, throw, try/catch</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag compress">Tier 3: Compress</span>
            <span className="tier-percent">6.9%</span>
            <p className="tier-desc">Variable declarations, await expressions</p>
          </div>
          <div className="tier-card">
            <span className="tier-tag drop">Tier 4: Drop</span>
            <span className="tier-percent">86.6%</span>
            <p className="tier-desc">String contents, operators, punctuation, comments. Noise.</p>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Live Demo */}
      <LiveDemo />

      <div className="ticks"></div>

      {/* Commands */}
      <section id="commands">
        <h2>Get started</h2>
        <div className="install-grid">
          <div className="install-option">
            <h3>MCP Plugin</h3>
            <p className="install-desc">For Claude Code, Cursor, Gemini CLI, and any MCP client. Hook-enforced causal memory on every edit.</p>
            <CodeBlock language="bash" code={`# Install + register
npm install -g composto-ai
claude mcp add composto -- composto-mcp

# Claude now has 5 tools:
# composto_ir           compressed IR for any file
# composto_benchmark    token savings report
# composto_context      smart context packing
# composto_scan         security scanner
# composto_blastradius  historical blast radius (beta)`} />
          </div>
          <div className="install-option">
            <h3>CLI</h3>
            <p className="install-desc">Standalone command-line tool. Works with any project.</p>
            <CodeBlock language="bash" code={`# Install globally
npm install -g composto-ai

# See how much you save
composto benchmark .

# Generate IR for any file
composto ir src/app.ts

# Smart context within budget
composto context src/ --budget 2000

# Historical blast radius (beta)
COMPOSTO_BLASTRADIUS=1 composto index
composto impact src/auth/login.ts`} />
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Footer */}
      <section id="footer">
        <span>Composto | less tokens, more insight</span>
        <div className="footer-links">
          <Link to="/docs">Docs</Link>
          <a href="https://github.com/mertcanaltin/composto" target="_blank">GitHub</a>
          <a href="https://www.npmjs.com/package/composto-ai" target="_blank">npm</a>
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/benchmark-proof.md" target="_blank">Benchmark</a>
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/blastradius-proof.md" target="_blank">BlastRadius proof</a>
        </div>
      </section>
    </>
  )
}

export default App
