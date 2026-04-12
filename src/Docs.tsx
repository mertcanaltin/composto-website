import { Link } from 'react-router-dom'
import { CodeBlock } from './components/CodeBlock'
import './Docs.css'

function Docs() {
  return (
    <>
      <nav className="docs-nav">
        <Link to="/" className="docs-back">← Back to home</Link>
        <span className="docs-title">Composto Docs</span>
      </nav>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <h4>Contents</h4>
          <ul>
            <li><a href="#what">What is Composto</a></li>
            <li><a href="#how">How it works</a></li>
            <li><a href="#tiers">The 4 tiers</a></li>
            <li><a href="#layers">IR layers (L0–L3)</a></li>
            <li><a href="#install">Installation</a></li>
            <li><a href="#cli">CLI commands</a></li>
            <li><a href="#mcp">MCP plugin</a></li>
            <li><a href="#target">Target mode</a></li>
            <li><a href="#context">Context budget</a></li>
            <li><a href="#comments">On comments</a></li>
            <li><a href="#quality">Quality tradeoffs</a></li>
            <li><a href="#languages">Language support</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </aside>

        <main className="docs-content">

          <section id="what">
            <h1>What is Composto</h1>
            <p>
              Composto is a code compression tool for Large Language Models. It parses source code
              into an Abstract Syntax Tree (AST) using tree-sitter, classifies every node by structural
              importance, and emits a compressed Intermediate Representation (IR) that preserves meaning
              while dropping syntax noise.
            </p>
            <p>
              The result: your LLM receives up to <strong>89% fewer tokens</strong> but still understands
              what the code does.
            </p>
          </section>

          <section id="how">
            <h2>How it works</h2>
            <p>
              Think of code like an iceberg. The visible tip, the 14%, is what your LLM
              actually needs: function signatures, control flow, imports, class hierarchies.
              Everything below the waterline (braces, semicolons, string contents, punctuation,
              formatting) is syntactical scaffolding humans need to read code.
            </p>

            <figure className="docs-figure">
              <img src="/iceberg.svg" alt="AST iceberg showing 14% structural meaning above the waterline and 86% syntax noise below" />
              <figcaption>Composto sends only what's above the waterline.</figcaption>
            </figure>

            <p>
              When a compiler reads your code, it doesn't linger on whitespace or brace placement.
              It parses the text into a structured tree and reasons over that tree. Composto
              does the same, then sends the tree directly to the LLM.
            </p>

            <figure className="docs-figure">
              <img src="/pipeline.svg" alt="Composto pipeline: code parsed into AST, classified by tier, compressed into IR, sent to LLM" />
              <figcaption>The Composto pipeline.</figcaption>
            </figure>
          </section>

          <section id="tiers">
            <h2>The 4 tiers</h2>
            <p>Every AST node gets classified into one of four tiers:</p>
            <figure className="docs-figure">
              <img src="/tier-breakdown.svg" alt="Visual breakdown of tier distribution: Tier 4 takes 86.6% of all AST nodes" />
              <figcaption>Most of your code is Tier 4.</figcaption>
            </figure>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Action</th>
                  <th>Examples</th>
                  <th>% of nodes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tier 1</strong></td>
                  <td>Keep</td>
                  <td>imports, functions, classes, interfaces, types, enums</td>
                  <td>0.8%</td>
                </tr>
                <tr>
                  <td><strong>Tier 2</strong></td>
                  <td>Summarize</td>
                  <td>if, for, while, switch, return, throw, try/catch</td>
                  <td>0.9%</td>
                </tr>
                <tr>
                  <td><strong>Tier 3</strong></td>
                  <td>Compress</td>
                  <td>variable declarations (module-scope only), await expressions</td>
                  <td>6.9%</td>
                </tr>
                <tr>
                  <td><strong>Tier 4</strong></td>
                  <td>Drop</td>
                  <td>braces, semicolons, string contents, operators, whitespace, comments</td>
                  <td>86.6%</td>
                </tr>
              </tbody>
            </table>
            <p>
              Tier 4 is the largest category by far. These are the tokens your LLM doesn't need to
              understand what the code does.
            </p>
          </section>

          <section id="layers">
            <h2>IR layers (L0 to L3)</h2>
            <p>
              Composto produces different representations at different levels of detail. You pick
              the right layer for the task.
            </p>

            <figure className="docs-figure">
              <img src="/layer-comparison.svg" alt="Side by side comparison of L0, L1, L2, L3 representations" />
              <figcaption>Same function, four layers, different token budgets.</figcaption>
            </figure>

            <h3>L0, Structure map</h3>
            <p>Just names and line numbers. Use when you need navigation, not behavior.</p>
            <CodeBlock language="ir" code={`src/auth/session.ts
  FN:createSession L5
  FN:validateToken L23
  CLASS:SessionManager L45`} />
            <p><em>Typical savings: 95–98%</em></p>

            <h3>L1, Full IR</h3>
            <p>Signatures, control flow, imports. The default for comprehension tasks.</p>
            <CodeBlock language="ir" code={`USE:jsonwebtoken
OUT ASYNC FN:validateToken(token: string)
  TRY
    VAR:decoded = verify(token, secret)
    IF:decoded.exp < Date.now() / 1000 → RET false
    RET db.sessions.exists(decoded.sessionId)
  CATCH:err
    RET false`} />
            <p><em>Typical savings: 80–92%</em></p>

            <h3>L2, Delta context</h3>
            <p>For code reviews. Only shows changed lines + surrounding context.</p>
            <CodeBlock language="ir" code={`FILE: src/auth/session.ts
SCOPE: validateToken
CHANGED:
  + if (decoded.exp < Date.now() / 1000) return false
CONTEXT: TRY ... CATCH ...
BLAME: mecaltin, 2026-04-10, "fix: token expiry check"`} />

            <h3>L3, Raw source</h3>
            <p>The original code, unchanged. Use for bug fixes and precise edits.</p>
          </section>

          <section id="install">
            <h2>Installation</h2>

            <h3>CLI</h3>
            <CodeBlock language="bash" code={`npm install -g composto-ai
composto benchmark .`} />

            <h3>MCP plugin (Claude Code, Cursor, Claude Desktop)</h3>
            <CodeBlock language="bash" code={`claude mcp add composto -- npx composto-mcp`} />

            <p>Claude Desktop config (<code>~/Library/Application Support/Claude/claude_desktop_config.json</code>):</p>
            <CodeBlock language="bash" code={`{
  "mcpServers": {
    "composto": {
      "command": "npx",
      "args": ["composto-mcp"]
    }
  }
}`} />
          </section>

          <section id="cli">
            <h2>CLI commands</h2>

            <h3>benchmark</h3>
            <p>Measure token savings across a directory. No API key needed.</p>
            <CodeBlock language="bash" code={`composto benchmark <path>`} />

            <h3>ir</h3>
            <p>Generate IR for a single file.</p>
            <CodeBlock language="bash" code={`composto ir <file> [L0|L1|L2|L3]`} />

            <h3>context</h3>
            <p>Pack multiple files into a token budget.</p>
            <CodeBlock language="bash" code={`composto context <path> --budget 4000
composto context <path> --target validateToken --budget 4000`} />

            <h3>scan</h3>
            <p>Security and code smell detector (hardcoded secrets, debug artifacts).</p>
            <CodeBlock language="bash" code={`composto scan <path>`} />

            <h3>trends</h3>
            <p>Analyze git history for hotspots, decay signals, inconsistencies.</p>
            <CodeBlock language="bash" code={`composto trends <path>`} />

            <h3>benchmark-quality</h3>
            <p>Compare raw code vs IR answers from Claude (requires ANTHROPIC_API_KEY).</p>
            <CodeBlock language="bash" code={`composto benchmark-quality <file>`} />
          </section>

          <section id="mcp">
            <h2>MCP plugin</h2>
            <p>
              When installed as an MCP server, Composto exposes 4 tools that your AI assistant
              can call autonomously:
            </p>
            <ul>
              <li><code>composto_ir</code>, generate IR for a file</li>
              <li><code>composto_benchmark</code>, token savings report</li>
              <li><code>composto_context</code>, pack files within a budget (supports target)</li>
              <li><code>composto_scan</code>, find security issues</li>
            </ul>
            <p>
              Your AI assistant will automatically pick these tools when asked about code.
              You don't need to change your workflow.
            </p>
          </section>

          <section id="target">
            <h2>Target mode</h2>
            <p>
              For implementation tasks like fixing bugs, editing functions, or tracing wrong values,
              use the <code>--target</code> flag.
            </p>
            <CodeBlock language="bash" code={`composto context . --target validateToken --budget 4000`} />

            <figure className="docs-figure">
              <img src="/target-mode.svg" alt="Target mode: target file at L3, related files at L1, rest at L0" />
              <figcaption>Target file gets full detail, context gets compressed.</figcaption>
            </figure>

            <p>How the layer assignment works:</p>
            <ul>
              <li>File containing <code>validateToken</code> → <strong>L3 (raw code)</strong></li>
              <li>Files that import or are imported by the target → <strong>L1</strong></li>
              <li>Hotspot files (high churn in git) → <strong>L1</strong></li>
              <li>Everything else → <strong>L0</strong></li>
            </ul>
            <p>
              You get the exact code for the function you're working on, plus compressed context
              for everything around it. The LLM can fix implementation details while still
              understanding the architecture.
            </p>
          </section>

          <section id="context">
            <h2>Context budget</h2>
            <p>
              <code>composto context</code> packs files into a fixed token budget. The algorithm:
            </p>
            <ol>
              <li>Generate L0 for every file in scope (cheap, ~20 tokens each)</li>
              <li>If total exceeds budget, truncate from lowest-priority files</li>
              <li>Upgrade files to L1 in priority order: target file &gt; related &gt; hotspots &gt; size</li>
              <li>Stop when next L1 upgrade would exceed budget</li>
            </ol>
            <p>
              Result: you never exceed your budget, and the most important files always get the
              most detail.
            </p>
          </section>

          <section id="comments">
            <h2>On comments</h2>
            <p>This comes up often, so here's the explicit answer.</p>

            <h3>JSDoc on exported symbols</h3>
            <p>
              Kept. Specifically <code>@deprecated</code> tags and short descriptions (up to 30 chars).
              These carry structural metadata that affects consumers of your API.
            </p>
            <CodeBlock language="ir" code={`@deprecated "Validates JWT token" OUT FN:validateToken(token)`} />

            <h3>Python docstrings</h3>
            <p>Kept. First line only, 30-char max. Same principle, structural signal.</p>

            <h3>Regular comments (<code>//</code> and <code>/* */</code>)</h3>
            <p>
              <strong>Dropped.</strong> This is a deliberate tradeoff. A comment like
              <code>// handles the race condition when retry hits timeout</code> is valuable
              narrative, but doesn't compress to a symbol. For tasks that need narrative context,
              use <code>--target</code> to include the target file as raw code.
            </p>

            <h3>Internal JSDoc</h3>
            <p>
              Dropped. If a function isn't exported, its JSDoc is considered implementation detail,
              not API contract.
            </p>
          </section>

          <section id="quality">
            <h2>Quality tradeoffs</h2>
            <p>Composto is a filter, not a summarizer. What it preserves and what it drops:</p>

            <h3>Preserved</h3>
            <ul>
              <li>Function signatures with parameter types and return types</li>
              <li>Class hierarchies (including runtime inheritance via <code>Object.setPrototypeOf</code>)</li>
              <li>Import and export graph</li>
              <li>Control flow (if, for, while, switch, try/catch)</li>
              <li>Return value shapes (truncated at 60 chars)</li>
              <li>Guard clauses (<code>if (cond) return</code>)</li>
              <li>Qualified method names (<code>UserService.login</code>)</li>
              <li>JSDoc tags on public API</li>
            </ul>

            <h3>Dropped</h3>
            <ul>
              <li>Braces, semicolons, punctuation</li>
              <li>String literal contents</li>
              <li>Operators in non-structural positions</li>
              <li>Internal variable declarations</li>
              <li>Exact arithmetic formulas</li>
              <li>Comments (<code>//</code>, <code>/* */</code>) outside JSDoc</li>
              <li>Whitespace and formatting</li>
            </ul>

            <figure className="docs-figure">
              <img src="/cost-savings.svg" alt="Monthly cost comparison: without Composto vs with Composto at 50 calls per day" />
              <figcaption>Cost impact at 50 calls per day on Claude Opus.</figcaption>
            </figure>

            <h3>When to use what</h3>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Recommended layer</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>"What does this file do?"</td><td>L1</td></tr>
                <tr><td>"What are the dependencies?"</td><td>L1</td></tr>
                <tr><td>"Explain the architecture"</td><td>L1 (or context budget)</td></tr>
                <tr><td>"Fix this bug on line 42"</td><td>L3 via <code>--target</code></td></tr>
                <tr><td>"Review this PR"</td><td>L2 + L1 surrounding</td></tr>
                <tr><td>"What files are in this repo?"</td><td>L0</td></tr>
              </tbody>
            </table>
          </section>

          <section id="languages">
            <h2>Language support</h2>
            <p>Composto uses tree-sitter grammars. Currently supported:</p>
            <ul>
              <li>TypeScript / TSX (deeply tuned)</li>
              <li>JavaScript / JSX (deeply tuned)</li>
              <li>Python (basic support)</li>
              <li>Go (basic support)</li>
              <li>Rust (basic support)</li>
            </ul>
            <p>
              Files with unsupported extensions fall back to a regex-based fingerprinter.
              The fingerprinter is less accurate but works on any text file.
            </p>
          </section>

          <section id="faq">
            <h2>FAQ</h2>

            <h3>Does Composto edit my code?</h3>
            <p>
              No. Composto only transforms code for reasoning. When the LLM generates a fix,
              the fix is regular code that you apply to your files normally.
            </p>

            <h3>Do I need an API key?</h3>
            <p>
              Only for <code>benchmark-quality</code>, which runs real Claude API calls to compare
              answers. All other commands (benchmark, ir, context, scan, trends) work offline.
            </p>

            <h3>What if my target symbol exists in multiple files?</h3>
            <p>
              Composto picks the first declaration match. Current implementation uses regex to
              find declarations, which can be fooled by unusual code. v0.4 will use AST-based
              symbol resolution for precision.
            </p>

            <h3>Does Composto work with minified code?</h3>
            <p>
              It tries, but compression ratios drop significantly because minified code is already
              optimized for size. Not the primary use case.
            </p>

            <h3>Is the data accurate if the LLM wasn't trained on IR format?</h3>
            <p>
              IR is structurally regular (<code>FN:</code>, <code>IF:</code>, <code>RET</code>) and
              close to pseudocode, which all major LLMs handle well. Verified empirically on
              Fastify, Undici, Node.js, and synthetic unseen projects like ata-keywords.
            </p>

            <h3>What happens when models get better at large contexts?</h3>
            <p>
              Compression is still valuable. Even with infinite context windows, fewer tokens
              mean lower latency, better recall per prompt, and lower cost. Different axis
              from model capability.
            </p>
          </section>

          <footer className="docs-footer">
            <p>
              <Link to="/">← Back to home</Link>
              {' · '}
              <a href="https://github.com/mertcanaltin/composto" target="_blank">GitHub</a>
              {' · '}
              <a href="https://www.npmjs.com/package/composto-ai" target="_blank">npm</a>
            </p>
          </footer>

        </main>
      </div>
    </>
  )
}

export default Docs
