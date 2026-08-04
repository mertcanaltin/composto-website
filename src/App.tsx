import { Link } from 'react-router-dom'
import './App.css'
import { Logo } from './components/Logo'
import { CodeBlock } from './components/CodeBlock'
import { CodeSlider } from './components/CodeSlider'
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
    IF:!email || !password → RET reply.code(400)
    AWAIT:result = pool.query("SELECT * FROM users...")
    IF:!user → RET reply.code(401)
    AWAIT:valid = bcrypt.compare(password, user.password_hash)
    IF:!valid → RET reply.code(401)
    RET reply.send({ token, user })`

function App() {
  return (
    <>
      {/* Hero */}
      <section id="hero">
        <Logo />
        <span className="badge">v0.13 | Local-first, MIT</span>
        <p className="hero-tagline">Decides what your coding agent reads</p>
        <p className="hero-slogan">And tells you when it doesn't know.</p>
        <p className="subtitle">
          Your agent has a token budget and a repo with thousands of files. Composto builds a
          ranked structural map of that repo, points at the file and the lines that matter, and
          says out loud when the map is incomplete. Works with Claude Code, Cursor, and Gemini CLI.
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
      </section>

      <div className="ticks"></div>

      {/* The problem, concretely */}
      <section id="problem">
        <h2 style={{ textAlign: 'center' }}>A repo map that runs out of budget is not a map</h2>
        <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 28px' }}>
          Until v0.13, Composto packed files in whatever order it walked the directory tree, then
          stopped when the budget ran out. Here is what that produced on the Node.js repository.
        </p>
        <div className="target-demo">
          <div className="target-panel">
            <h3>Before</h3>
            <CodeBlock language="bash" code={`composto context --budget 4000

  22491 files

  android_configure.py
  benchmark/_cli.js
  benchmark/abort_controller/...
  ...253 files, budget gone

# Zero files from lib/.
# None of Node's runtime
# source is in the map.`} />
          </div>
          <div className="target-panel">
            <h3>After</h3>
            <CodeBlock language="bash" code={`composto context --budget 4000

  22491 files

  lib/domain.js
  lib/tls.js
  lib/ffi.js
  lib/internal/modules/esm/...
  ...

  Omitted: 22445 files did
  not fit, this map is partial.`} />
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 15, maxWidth: 700, margin: '20px auto 0' }}>
          The agent asking "where does this behaviour live" went from finding the right file{' '}
          <strong>1 time in 100</strong> to <strong>22 times in 100</strong>, at the same budget.
        </p>
      </section>

      {/* Stats */}
      <section id="stats">
        <div className="stat">
          <div className="stat-value">22%</div>
          <div className="stat-label">Right file in the map, up from 1% (Node.js, 22,491 files, 4K budget)</div>
        </div>
        <div className="stat">
          <div className="stat-value">35&times;</div>
          <div className="stat-label">Closer to the top of the list (Bun, rank 255 → 7)</div>
        </div>
        <div className="stat">
          <div className="stat-value">&ge;93%</div>
          <div className="stat-label">--target lands on the file that declares the symbol, 5 repos</div>
        </div>
        <div className="stat">
          <div className="stat-value">22,445</div>
          <div className="stat-label">Files it tells you it left out</div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Measured, including where it loses */}
      <section id="proof">
        <h2 style={{ textAlign: 'center' }}>Measured on repos you know</h2>
        <p style={{ textAlign: 'center', marginBottom: 8, maxWidth: 720, margin: '0 auto 20px' }}>
          Sample 100 symbols a real commit touched, ask whether the file declaring each one is in
          the map. Ground truth comes from git history; the ranking only sees file paths and
          structure, so the benchmark cannot confirm itself.
        </p>
        <div className="proof-table-wrapper">
        <table className="proof-table">
          <thead>
            <tr>
              <th>Repo</th>
              <th>Files</th>
              <th>Walk order</th>
              <th>Ranked</th>
              <th>Rank of the answer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Node.js</strong></td>
              <td>22,491</td>
              <td>1%</td>
              <td>22%</td>
              <td>92 → 24</td>
            </tr>
            <tr>
              <td><strong>Bun</strong></td>
              <td>6,340</td>
              <td>16%</td>
              <td>25%</td>
              <td>255 → 7</td>
            </tr>
            <tr>
              <td><strong>Deno</strong></td>
              <td>4,272</td>
              <td>5%</td>
              <td>7%</td>
              <td>30 → 18</td>
            </tr>
            <tr>
              <td><strong>undici</strong></td>
              <td>626</td>
              <td>72%</td>
              <td>80%</td>
              <td>120 → 49</td>
            </tr>
            <tr>
              <td><strong>Fastify</strong></td>
              <td>296</td>
              <td>97%</td>
              <td>100%</td>
              <td>132 → 54</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, maxWidth: 720, margin: '16px auto 0' }}>
          Read the Deno row: <strong>7%</strong>. Its source lives in <code>ext/</code>,{' '}
          <code>cli/</code> and <code>runtime/</code>, which the ranking does not yet recognise as
          source roots. Composto helps most where the budget genuinely binds and least where the
          layout is unfamiliar to it. The harness is in the repo, run it on yours.
        </p>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
          <a href="https://github.com/mertcanaltin/composto/blob/master/scripts/discovery-eval.ts" target="_blank">
            scripts/discovery-eval.ts
          </a>
        </p>
      </section>

      <div className="ticks"></div>

      {/* Honesty as a feature */}
      <section id="honesty">
        <h2 style={{ textAlign: 'center' }}>It tells you what it does not know</h2>
        <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 28px' }}>
          A partial map that reads as complete is worse than no map: the agent stops looking and
          concludes the code does not exist. Every answer carries its own limits.
        </p>
        <div className="target-demo">
          <div className="target-panel">
            <h3>When the budget binds</h3>
            <CodeBlock language="bash" code={`Omitted: 22445 files did not fit,
this map is partial. Raise --budget
to widen it.

# Absence from the map is not
# evidence of absence from the repo.`} />
          </div>
          <div className="target-panel">
            <h3>When it locates a target</h3>
            <CodeBlock language="bash" code={`composto context --target permission

Target: lib/internal/process/permission.js
coverage: high (exact symbol)

# medium  matched by filename, verify it
# low     only found as a reference
# none    not found, say so and stop`} />
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Use it in 3 steps */}
      <section id="get-started-3" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center' }}>Use it in 3 steps</h2>
        <CodeBlock language="bash" code={`# 1. Install
npm install -g composto-ai

# 2. See what your agent would get, local, no API key
cd your-project && composto context --budget 4000

# 3. Wire it into your agent
composto init --client=claude-code --with-compress   # or cursor, gemini-cli`} />
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--text)' }}>
          Existing settings are merged, never overwritten. On Claude Code, large file reads are
          replaced with structure automatically; run <code>composto stats</code> to see what that saved.
        </p>
      </section>

      <div className="ticks"></div>

      {/* Target Feature */}
      <section id="target">
        <h2>"But I need the exact code"</h2>
        <p style={{ textAlign: 'center', marginBottom: 24, maxWidth: 640, margin: '0 auto 24px' }}>
          Then read it. Structure is for finding code, source is for changing it. Composto's job is
          to make sure you open the right file, and only the lines you need.
        </p>
        <div className="target-demo">
          <div className="target-panel">
            <h3>You ask:</h3>
            <p className="target-quote">"Fix the bug in validateToken. It returns false for valid tokens."</p>
          </div>
          <div className="target-panel">
            <h3>Composto sends:</h3>
            <CodeBlock language="bash" code={`composto context . --target validateToken

# The file declaring it:  raw source
# Files that import it:   detailed IR
# Everything else:        structure only
# Symbols carry Lstart-end, so the next
# read is a line range, not a whole file`} />
          </div>
        </div>
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

      {/* Quality Proof */}
      <section id="quality">
        <h2>Does the agent lose understanding?</h2>
        <p style={{ textAlign: 'center', marginBottom: 24 }}>
          We asked real questions about real projects using only the structure, then verified every
          answer against the source.
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
            <span className="quality-score">Verified against source</span>
          </div>
          <div className="quality-card">
            <div className="quality-header">
              <h3>Node.js net.js</h3>
              <span className="quality-badge">2,569 lines → 192 IR</span>
            </div>
            <p className="quality-question">"What public API does this module expose?"</p>
            <p className="quality-answer">
              Identified createServer, connect, Socket constructor, auto-select family API, all helpers.
              Captures runtime inheritance: EXTENDS:Socket &lt; stream.Duplex
            </p>
            <span className="quality-score">Verified against source</span>
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
            <span className="quality-score">Verified against source</span>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          <a href="https://github.com/mertcanaltin/composto/blob/master/docs/quality-proof.md" target="_blank">Full methodology and verification</a>
        </p>
      </section>

      <div className="ticks"></div>

      {/* How It Works */}
      <section id="how">
        <h2>How it works</h2>
        <p>
          Tree-sitter parses your code into an AST and classifies every node, so what reaches the
          agent is shape rather than punctuation. Compression is the mechanism; deciding what to
          send is the product.
        </p>
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
            <h3>MCP server</h3>
            <p className="install-desc">For Claude Code, Cursor, Gemini CLI, and any MCP client.</p>
            <CodeBlock language="bash" code={`# Install + register
npm install -g composto-ai
claude mcp add composto -- composto-mcp

# Three tools, no more:
# composto_context    ranked map of the repo,
#                     target file as raw source
# composto_ir         what one file contains,
#                     symbols with line ranges
# composto_benchmark  token-savings report`} />
          </div>
          <div className="install-option">
            <h3>CLI</h3>
            <p className="install-desc">Standalone command-line tool. Works with any project.</p>
            <CodeBlock language="bash" code={`npm install -g composto-ai

# Ranked map within a token budget
composto context --budget 4000

# Locate a symbol, target file comes back raw
composto context --target validateToken

# What one file contains
composto ir src/app.ts L1

# Keep a map on disk, refreshed on change
composto reindex
composto start`} />
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Footer */}
      <section id="footer">
        <span>Composto | decides what your agent reads</span>
        <div className="footer-links">
          <Link to="/docs">Docs</Link>
          <a href="https://github.com/mertcanaltin/composto" target="_blank">GitHub</a>
          <a href="https://www.npmjs.com/package/composto-ai" target="_blank">npm</a>
          <a href="https://github.com/mertcanaltin/composto/blob/master/scripts/discovery-eval.ts" target="_blank">Benchmark harness</a>
        </div>
      </section>
    </>
  )
}

export default App
