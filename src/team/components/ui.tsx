import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { decisionById, type DecisionStatus, type PocResult, type SpecStatus } from '../lib/data'

export const specStatusColor: Record<SpecStatus, string> = {
  DRAFT: 'var(--color-st-open)',
  READY: 'var(--color-st-ready)',
  'IN-PROGRESS': 'var(--color-st-partly)',
  DONE: 'var(--color-st-done)',
  SUPERSEDED: 'var(--color-st-none)',
}

export const decisionStatusColor: Record<DecisionStatus, string> = {
  DECIDED: 'var(--color-st-done)',
  PARTLY: 'var(--color-st-partly)',
  TESTING: 'var(--color-st-ready)',
  OPEN: 'var(--color-st-open)',
}

export const pocColor: Record<PocResult, string> = {
  PENDING: 'var(--color-st-none)',
  PASS: 'var(--color-st-done)',
  FALLBACK: 'var(--color-st-ready)',
  FAIL: 'var(--color-st-fail)',
}

const glyph: Record<string, string> = {
  DONE: '✔',
  DECIDED: '✔',
  PASS: '✔',
  READY: '★',
  'IN-PROGRESS': '⚒',
  PARTLY: '◐',
  TESTING: '⚗',
  FALLBACK: '↺',
  DRAFT: '✎',
  OPEN: '?',
  PENDING: '…',
  FAIL: '✖',
  SUPERSEDED: '⤳',
}

/** Status pill: colour + glyph + word, so state never relies on colour alone. */
export function Badge({ status, color, dark = false }: { status: string; color: string; dark?: boolean }) {
  return (
    <span
      className="chip font-display tracking-wide"
      style={dark ? { color, background: 'rgb(0 0 0 / 0.3)' } : { color: '#fff', background: color, borderColor: 'rgb(0 0 0 / 0.35)', textShadow: '0 1px 0 rgb(0 0 0 / 0.45)' }}
    >
      <span aria-hidden>{glyph[status] ?? '•'}</span>
      {status}
    </span>
  )
}

export const SpecBadge = ({ status, dark }: { status: SpecStatus; dark?: boolean }) => <Badge status={status} color={specStatusColor[status]} dark={dark} />
export const DecisionBadge = ({ status, dark }: { status: DecisionStatus; dark?: boolean }) => <Badge status={status} color={decisionStatusColor[status]} dark={dark} />
export const PocBadge = ({ result, dark }: { result: PocResult; dark?: boolean }) => <Badge status={result} color={pocColor[result]} dark={dark} />

/** Linked decision id, tinted by its status. */
export function DecisionChip({ id, dark = false }: { id: string; dark?: boolean }) {
  const d = decisionById.get(id)
  const color = d ? decisionStatusColor[d.status] : 'var(--color-st-none)'
  return (
    <Link
      to={`/team/decisions#${id}`}
      title={d ? `${d.status} · ${d.question.replace(/\*\*/g, '')}` : id}
      className="chip font-mono hover:brightness-125"
      style={{ color: dark ? color : 'var(--color-paper-text)', borderColor: color, background: dark ? 'transparent' : 'rgb(255 247 207 / 0.35)', boxShadow: `inset 3px 0 0 ${color}` }}
    >
      {id}
      {d && d.status !== 'DECIDED' && <span className="sr-only">({d.status})</span>}
    </Link>
  )
}

export function SpecChip({ id, dark = false }: { id: string; dark?: boolean }) {
  return (
    <Link to={`/team/specs/${id}`} className={`chip font-mono hover:brightness-125 ${dark ? 'text-parch-ink' : 'text-paper-text'}`}>
      {id}
    </Link>
  )
}

export function RepoChip({ repo, dark = false }: { repo: string; dark?: boolean }) {
  return <span className={`chip font-mono ${dark ? 'border-slate-line text-parch-dim' : 'border-bark/50 text-paper-muted'}`}>{repo}</span>
}

export function Progress({ value, total, label }: { value: number; total: number; label?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-2" title={label ?? `${value}/${total}`}>
      <div className="bar-track flex-1" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right font-mono text-xs tabular-nums opacity-80">
        {value}/{total}
      </span>
    </div>
  )
}

export function PageHeader({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-6 sm:mb-8">
      {kicker && <p className="font-display text-sm tracking-widest text-leaf uppercase">{kicker}</p>}
      <h1 className="mt-1 text-3xl text-cream drop-shadow-[0_3px_0_rgb(0_0_0_/_0.6)] sm:text-4xl">{title}</h1>
      {children && <div className="mt-2 max-w-3xl text-parch-dim">{children}</div>}
    </header>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <h2 className="flex items-center gap-2 text-xl text-gold drop-shadow-[0_2px_0_rgb(0_0_0_/_0.6)]">
        <span aria-hidden className="inline-block size-2.5 bg-leaf shadow-[2px_2px_0_#2b3f18]" />
        {children}
      </h2>
      {aside}
    </div>
  )
}

export function StatTile({ label, value, of, hint, accent = 'var(--color-leaf)' }: { label: string; value: number | string; of?: number; hint?: string; accent?: string }) {
  return (
    <div className="slate px-4 py-3">
      <div className="text-xs tracking-wider text-parch-dim uppercase">{label}</div>
      <div className="mt-1 flex items-baseline gap-1 font-display">
        <span className="text-3xl text-cream tabular-nums">{value}</span>
        {of !== undefined && <span className="text-lg text-parch-dim tabular-nums">/ {of}</span>}
      </div>
      {of !== undefined && typeof value === 'number' && (
        <div className="mt-2 h-1.5 bg-black/40">
          <div className="h-full" style={{ width: `${of ? (value / of) * 100 : 0}%`, background: accent }} />
        </div>
      )}
      {hint && <div className="mt-2 text-xs text-parch-dim">{hint}</div>}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-parch-dim italic">{children}</p>
}

/** Render a markdown table cell's inline formatting (bold, code, strike) without a full parser. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`')) return <code key={i} className="bg-black/15 px-1 font-mono text-[0.92em]">{p.slice(1, -1)}</code>
        if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        if (p.startsWith('~~')) return <s key={i} className="opacity-60">{p.slice(2, -2)}</s>
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p)
        if (link) return <span key={i} className="underline decoration-dotted">{link[1]}</span>
        return <span key={i}>{p.replace(/⚠️\s?/g, '⚠ ')}</span>
      })}
    </>
  )
}
