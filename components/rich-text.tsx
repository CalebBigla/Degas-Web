import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'

/**
 * Renders the small formatting syntax used in the admin's longer text fields:
 *
 *   Blank line        → new paragraph
 *   "## " or "### "  → heading (when `headings` is on: articles, service pages)
 *   "- " at line start → bullet list
 *   **bold**          → bold
 *   [text](url)       → link (/path, https://, mailto: or tel: only)
 *
 * Output is built as React elements (never raw HTML), so it is safe to render
 * whatever an admin types.
 */

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

function safeHref(url: string): string | null {
  if (url.startsWith('/') && !url.startsWith('//')) return url
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url
  return null
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let index = 0
  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    const key = `${keyPrefix}-${index++}`

    if (match[1] !== undefined) {
      nodes.push(<strong key={key}>{match[1]}</strong>)
    } else {
      const label = match[2]!
      const href = safeHref(match[3]!)
      if (!href) nodes.push(label)
      else if (href.startsWith('/')) nodes.push(<Link key={key} href={href}>{label}</Link>)
      else {
        const external = /^https?:/i.test(href)
        nodes.push(
          <a
            key={key}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {label}
          </a>,
        )
      }
    }
    last = start + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function RichText({ text, headings = false }: { text: string; headings?: boolean }) {
  const blocks = text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <>
      {blocks.map((block, b) => {
        const lines = block.split('\n').map((line) => line.trim())
        const heading = headings ? /^(#{2,3})\s+(.+)$/.exec(lines[0]!) : null
        if (heading && lines.length === 1) {
          const Tag = heading[1] === '##' ? 'h2' : 'h3'
          return <Tag key={b}>{renderInline(heading[2]!, `${b}`)}</Tag>
        }
        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={b}>
              {lines.map((line, l) => (
                <li key={l}>{renderInline(line.replace(/^[-*]\s+/, ''), `${b}-${l}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={b}>
            {lines.map((line, l) => (
              <Fragment key={l}>
                {l > 0 && ' '}
                {renderInline(line, `${b}-${l}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}
