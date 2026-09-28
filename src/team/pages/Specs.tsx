import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DecisionChip, Empty, PageHeader, Progress, RepoChip, SpecBadge } from '../components/ui'
import { phaseLabel, SPEC_STATUSES, specs, type Spec } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { timeAgo } from '../../shared/time'
import { strings } from '../strings'

const allRepos = [...new Set(specs.flatMap((s) => s.repos))].sort()
const allPhases = [...new Set(specs.map((s) => s.phase))].sort((a, b) => (a ?? 99) - (b ?? 99))

function SpecCard({ s }: { s: Spec }) {
  const t = useDict(strings)
  return (
    <Link to={`/team/specs/${s.id}`} className="paper group flex flex-col p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-3xl leading-none text-bark/70 group-hover:text-bark-dark">{s.id}</span>
        <SpecBadge status={s.status} />
      </div>
      <h2 className="mt-2 text-lg leading-snug text-bark-dark">{s.title}</h2>
      {s.story && <p className="mt-1 line-clamp-3 text-sm text-paper-muted">{s.story}</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        {s.repos.map((r) => (
          <RepoChip key={r} repo={r} />
        ))}
        {s.fireMode && <span className="chip border-bark/50 text-paper-muted">FIRE {s.fireMode}</span>}
      </div>
      {s.blockers.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-paper-muted">{t.specs.blockedBy(s.blockers.length)}</p>
          <div className="flex flex-wrap gap-1">
            {s.blockers.slice(0, 8).map((d) => (
              <DecisionChip key={d} id={d} />
            ))}
            {s.blockers.length > 8 && <span className="chip border-bark/40 text-paper-muted">+{s.blockers.length - 8}</span>}
          </div>
        </div>
      )}
      <div className="mt-auto pt-4">
        {s.acceptance.total > 0 && <Progress value={s.acceptance.done} total={s.acceptance.total} label={t.specs.acceptance} />}
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-paper-muted">
          <span>{phaseLabel(s.phase)}</span>
          <span>
            {s.openQuestions.length > 0 && `${t.specs.openQ(s.openQuestions.length)} · `}
            {t.common.updated} {timeAgo(s.updated)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function FilterRow({ label, options, value, onChange }: { label: string; options: { v: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const all = useDict(strings).common.all
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="w-20 shrink-0 text-xs tracking-wider text-parch-dim uppercase">{label}</span>
      {[{ v: '', label: all }, ...options].map((o) => (
        <button key={o.v} className="btn px-2 py-1 text-xs" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Specs() {
  const t = useDict(strings)
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const repo = params.get('repo') ?? ''
  const phase = params.get('phase') ?? ''
  const q = params.get('q') ?? ''
  const blocked = params.get('blocked') ?? ''

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return specs.filter(
      (s) =>
        (!status || s.status === status) &&
        (!repo || s.repos.includes(repo)) &&
        (!phase || String(s.phase) === phase) &&
        (!blocked || (blocked === 'yes' ? s.blockers.length > 0 : s.blockers.length === 0)) &&
        (!needle || `${s.id} ${s.title} ${s.story} ${s.target} ${s.decisions.join(' ')}`.toLowerCase().includes(needle)),
    )
  }, [status, repo, phase, q, blocked])

  return (
    <>
      <PageHeader kicker={t.specs.kicker} title={t.specs.title}>
        {t.specs.intro1} <code className="font-mono text-gold">docs/NNN-*.md</code>
        {t.specs.intro2}
      </PageHeader>

      <div className="slate mb-6 flex flex-col gap-3 p-4">
        <label className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-xs tracking-wider text-parch-dim uppercase">{t.common.search}</span>
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder={t.specs.placeholder}
            className="w-full max-w-md border-2 border-bark bg-night px-3 py-1.5 text-parch-ink placeholder:text-parch-dim/60 focus:border-leaf focus:outline-none"
          />
        </label>
        <FilterRow label={t.specs.status} value={status} onChange={(v) => set('status', v)} options={SPEC_STATUSES.filter((s) => specs.some((x) => x.status === s)).map((s) => ({ v: s, label: s }))} />
        <FilterRow label={t.specs.phase} value={phase} onChange={(v) => set('phase', v)} options={allPhases.map((p) => ({ v: String(p), label: phaseLabel(p).replace(/^(?:Phase|เฟส) (\d+): /, 'P$1 ') }))} />
        <FilterRow label={t.specs.repo} value={repo} onChange={(v) => set('repo', v)} options={allRepos.map((r) => ({ v: r, label: r }))} />
        <FilterRow
          label={t.specs.blocked}
          value={blocked}
          onChange={(v) => set('blocked', v)}
          options={[
            { v: 'yes', label: t.specs.hasOpen },
            { v: 'no', label: t.specs.unblocked },
          ]}
        />
      </div>

      <p className="mb-3 text-sm text-parch-dim">
        {t.specs.count(list.length, specs.length)}
      </p>
      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <SpecCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <Empty>{t.specs.none}</Empty>
      )}
    </>
  )
}
