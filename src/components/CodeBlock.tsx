import { useMemo } from 'react'

interface Props {
  code: string
  language: 'typescript' | 'ir' | 'bash'
}

function highlightTS(code: string): string {
  return code
    // strings (double, single, backtick) — must come before keywords
    .replace(/(["'`])(?:(?!\1).)*?\1/g, '<span class="hl-string">$&</span>')
    // comments
    .replace(/(\/\/.*)/g, '<span class="hl-comment">$1</span>')
    // keywords
    .replace(/\b(import|export|from|type|async|function|const|let|var|if|else|return|switch|case|default|await|new|null)\b/g, '<span class="hl-keyword">$1</span>')
    // types
    .replace(/\b(string|number|boolean|void|null|Promise|HealthAnnotation|DeltaContext|IRLayer)\b(?!<\/span>)/g, '<span class="hl-type">$1</span>')
    // function names after function keyword
    .replace(/(?<=function\s+)(\w+)/g, '<span class="hl-fn">$1</span>')
}

function highlightBash(code: string): string {
  return code
    // comments
    .replace(/(#.*)/g, '<span class="hl-comment">$1</span>')
    // commands
    .replace(/\b(npm|npx|composto|install|git|clone|pnpm)\b/g, '<span class="hl-keyword">$1</span>')
    // flags
    .replace(/(\s-[-\w]+)/g, '<span class="hl-type">$1</span>')
}

function highlightIR(code: string): string {
  return code
    // strings in IR
    .replace(/(["'`])(?:(?!\1).)*?\1/g, '<span class="hl-string">$&</span>')
    // IR tags
    .replace(/\b(USE|OUT|ASYNC|FN|CLASS|INTERFACE|TYPE|ENUM|IF|ELSE|LOOP|WHILE|SWITCH|CASE|DEFAULT|RET|TRY|CATCH|THROW|AWAIT|VAR|CALL|METHOD|GET|SET):?/g, '<span class="hl-ir-tag">$1</span>')
    // arrow
    .replace(/\u2192/g, '<span class="hl-ir-arrow">\u2192</span>')
}

export function CodeBlock({ code, language }: Props) {
  const html = useMemo(() => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    if (language === 'typescript') return highlightTS(escaped)
    if (language === 'ir') return highlightIR(escaped)
    return highlightBash(escaped)
  }, [code, language])

  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}
