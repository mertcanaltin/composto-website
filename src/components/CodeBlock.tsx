import { useMemo } from 'react'

interface Props {
  code: string
  language: 'typescript' | 'ir' | 'bash'
}

// Token-based highlighting: process code character-by-character to avoid
// regex collisions on already-inserted HTML (e.g. "string" appearing inside
// a <span class="hl-str"> attribute being re-matched as a TS type keyword).
function highlightTS(code: string): string {
  const tokens: string[] = []
  let i = 0

  const TS_KEYWORDS = new Set([
    'import', 'export', 'from', 'type', 'async', 'function',
    'const', 'let', 'var', 'if', 'else', 'return', 'switch',
    'case', 'default', 'await', 'new', 'null', 'interface', 'class',
  ])
  const TS_TYPES = new Set([
    'string', 'number', 'boolean', 'void', 'Promise',
    'HealthAnnotation', 'DeltaContext', 'IRLayer',
  ])

  while (i < code.length) {
    const ch = code[i]

    // String literals: "...", '...', `...`
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let j = i + 1
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j += 2
        else j++
      }
      const str = code.slice(i, j + 1)
      tokens.push(`<span class="cb-str">${escapeHtml(str)}</span>`)
      i = j + 1
      continue
    }

    // Single-line comment
    if (ch === '/' && code[i + 1] === '/') {
      let j = i
      while (j < code.length && code[j] !== '\n') j++
      tokens.push(`<span class="cb-com">${escapeHtml(code.slice(i, j))}</span>`)
      i = j
      continue
    }

    // Identifier or keyword
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)
      if (TS_KEYWORDS.has(word)) {
        tokens.push(`<span class="cb-kw">${word}</span>`)
      } else if (TS_TYPES.has(word)) {
        tokens.push(`<span class="cb-ty">${word}</span>`)
      } else {
        tokens.push(escapeHtml(word))
      }
      i = j
      continue
    }

    // Everything else
    tokens.push(escapeHtml(ch))
    i++
  }

  return tokens.join('')
}

function highlightIR(code: string): string {
  const tokens: string[] = []
  let i = 0

  const IR_TAGS = new Set([
    'USE', 'OUT', 'ASYNC', 'FN', 'CLASS', 'INTERFACE', 'TYPE', 'ENUM',
    'IF', 'ELSE', 'LOOP', 'WHILE', 'SWITCH', 'CASE', 'DEFAULT',
    'RET', 'TRY', 'CATCH', 'THROW', 'AWAIT', 'VAR', 'CALL',
    'METHOD', 'GET', 'SET', 'GUARD', 'EXTENDS', 'FIELD',
  ])

  while (i < code.length) {
    const ch = code[i]

    // String literals
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let j = i + 1
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j += 2
        else j++
      }
      const str = code.slice(i, j + 1)
      tokens.push(`<span class="cb-str">${escapeHtml(str)}</span>`)
      i = j + 1
      continue
    }

    // Arrow character
    if (ch === '\u2192') {
      tokens.push(`<span class="cb-arrow">\u2192</span>`)
      i++
      continue
    }

    // IR tag (uppercase word followed by : or end of word)
    if (/[A-Z]/.test(ch)) {
      let j = i
      while (j < code.length && /[A-Z_]/.test(code[j])) j++
      const word = code.slice(i, j)
      if (IR_TAGS.has(word)) {
        tokens.push(`<span class="cb-tag">${word}</span>`)
        i = j
        continue
      }
    }

    tokens.push(escapeHtml(ch))
    i++
  }

  return tokens.join('')
}

function highlightBash(code: string): string {
  const tokens: string[] = []
  let i = 0

  const BASH_CMDS = new Set(['npm', 'npx', 'composto', 'install', 'git', 'clone', 'pnpm', 'node', 'claude'])

  while (i < code.length) {
    const ch = code[i]

    // Comment
    if (ch === '#') {
      let j = i
      while (j < code.length && code[j] !== '\n') j++
      tokens.push(`<span class="cb-com">${escapeHtml(code.slice(i, j))}</span>`)
      i = j
      continue
    }

    // Flag (--flag or -f)
    if (ch === '-' && (code[i + 1] === '-' || /[A-Za-z]/.test(code[i + 1]))) {
      let j = i
      while (j < code.length && /[-\w=]/.test(code[j])) j++
      tokens.push(`<span class="cb-flag">${escapeHtml(code.slice(i, j))}</span>`)
      i = j
      continue
    }

    // Word
    if (/[A-Za-z_]/.test(ch)) {
      let j = i
      while (j < code.length && /[A-Za-z0-9_-]/.test(code[j])) j++
      const word = code.slice(i, j)
      if (BASH_CMDS.has(word)) {
        tokens.push(`<span class="cb-kw">${word}</span>`)
      } else {
        tokens.push(escapeHtml(word))
      }
      i = j
      continue
    }

    tokens.push(escapeHtml(ch))
    i++
  }

  return tokens.join('')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function CodeBlock({ code, language }: Props) {
  const html = useMemo(() => {
    if (language === 'typescript') return highlightTS(code)
    if (language === 'ir') return highlightIR(code)
    return highlightBash(code)
  }, [code, language])

  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}
