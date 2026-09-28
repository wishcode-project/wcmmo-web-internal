import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { routeFor } from '../lib/data'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s/g, '-')

const textOf = (node: unknown): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node && typeof node === 'object' && 'props' in node) return textOf((node as { props: { children?: unknown } }).props.children)
  return ''
}

/** Resolve a link found in `basePath` (repo-relative) to a site route, or leave external links alone. */
function resolveHref(href: string, basePath: string): { to?: string; href?: string } {
  if (/^[a-z]+:/i.test(href)) return { href }
  if (href.startsWith('#')) return { href }
  const [path, hash] = href.split('#')
  if (!path.endsWith('.md')) return { href }
  const parts = basePath.split('/').slice(0, -1)
  for (const seg of path.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg !== '.') parts.push(seg)
  }
  return { to: routeFor(parts.join('/')) + (hash ? `#${hash}` : '') }
}

export function Markdown({ source, basePath }: { source: string; basePath: string }) {
  const heading =
    (Tag: 'h1' | 'h2' | 'h3' | 'h4') =>
    ({ children }: { children?: React.ReactNode }) => (
      <Tag id={slugify(textOf(children))} className="scroll-mt-24">
        {children}
      </Tag>
    )

  return (
    <div className="prose-paper">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: heading('h1'),
          h2: heading('h2'),
          h3: heading('h3'),
          h4: heading('h4'),
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ href = '', children }) => {
            const r = resolveHref(href, basePath)
            if (r.to) return <Link to={r.to}>{children}</Link>
            const external = /^https?:/.test(r.href ?? '')
            return (
              <a href={r.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
