import { useMemo, useState } from 'react'
import { DecisionBadge, Empty, Inline, PageHeader, SectionTitle, SpecChip, decisionStatusColor } from '../components/ui'
import { decisionAreas, decisionLog, decisions, type DecisionStatus } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { fmtDate } from '../../shared/time'
import { strings } from '../strings'

const STATUSES: DecisionStatus[] = ['OPEN', 'TESTING', 'PARTLY', 'DECIDED']

export function Decisions() {
  const t = useDict(strings)
  const [status, setStatus] = useState<DecisionStatus | ''>('')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return decisions.filter(
      (d) => (!status || d.status === status) && (!needle || `${d.id} ${d.question} ${d.recommendation} ${d.answer} ${d.area}`.toLowerCase().includes(needle)),
    )
  }, [status, q])

  return (
    <>
      <PageHeader kicker={t.decisions.kicker} title={t.decisions.title}>
        {t.decisions.intro}
      </PageHeader>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUSES.map((s) => {
          const n = decisions.filter((d) => d.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatus(status === s ? '' : s)}
              aria-pressed={status === s}
              className="slate flex items-center justify-between px-4 py-3 text-left transition hover:brightness-110 aria-pressed:outline-2 aria-pressed:outline-gold"
            >
              <DecisionBadge status={s} dark />
              <span className="font-display text-3xl tabular-nums" style={{ color: decisionStatusColor[s] }}>
                {n}
              </span>
            </button>
          )
        })}
      </div>

      <label className="mb-6 flex items-center gap-2">
        <span className="sr-only">{t.decisions.search}</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.decisions.search}
          className="w-full max-w-md border-2 border-bark bg-night px-3 py-1.5 text-parch-ink placeholder:text-parch-dim/60 focus:border-leaf focus:outline-none"
        />
        {(status || q) && (
          <button
            className="btn text-xs"
            onClick={() => {
              setStatus('')
              setQ('')
            }}
          >
            {t.common.clear}
          </button>
        )}
      </label>

      {decisionAreas.map((area) => {
        const ds = list.filter((d) => d.area === area)
        if (!ds.length) return null
        return (
          <section key={area} className="mb-8">
            <SectionTitle>{area}</SectionTitle>
            <div className="grid gap-4 lg:grid-cols-2">
              {ds.map((d) => (
                <article key={d.id} id={d.id} className="paper scroll-mt-24 p-5 target:outline-4 target:outline-gold">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-2xl text-bark-dark">{d.id}</span>
                    <DecisionBadge status={d.status} />
                  </div>
                  <h3 className="mt-1 font-sans text-base font-bold tracking-normal text-bark-dark">
                    <Inline text={d.question} />
                  </h3>
                  {d.options && d.options !== '—' && (
                    <p className="mt-1 text-sm text-paper-muted">
                      <span className="font-medium">{t.decisions.options}</span>
                      <Inline text={d.options} />
                    </p>
                  )}
                  <div className="pixel-divider my-3 opacity-50" />
                  <p className="text-sm">
                    <span className="font-display text-bark">{t.decisions.recommendation}</span>
                    <Inline text={d.recommendation} />
                  </p>
                  {d.answer && (
                    <p className="mt-2 border-l-4 border-leaf-dark bg-leaf/15 px-3 py-1.5 text-sm">
                      <span className="font-display text-leaf-dark">{t.decisions.ownersCall}</span>
                      <Inline text={d.answer} />
                    </p>
                  )}
                  {d.status !== 'DECIDED' && d.rawStatus && d.rawStatus !== d.status && <p className="mt-2 text-xs text-paper-muted">
                      {t.decisions.status}
                      {d.rawStatus}
                    </p>}
                  {d.specs.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      <span className="mr-1 text-xs text-paper-muted">{t.decisions.citedBy}</span>
                      {d.specs.map((s) => (
                        <SpecChip key={s} id={s} />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}
      {!list.length && <Empty>{t.decisions.none}</Empty>}

      <section className="mt-12">
        <SectionTitle>{t.decisions.log}</SectionTitle>
        <ol className="relative ml-2 border-l-4 border-bark pl-6">
          {decisionLog.map((e, i) => (
            <li key={i} className="relative mb-4">
              <span aria-hidden className="absolute top-1.5 -left-[33px] size-3.5 bg-leaf shadow-[0_0_0_3px_var(--color-night),2px_2px_0_3px_#2b3f18]" />
              <div className="text-xs text-parch-dim">
                {fmtDate(e.date)} · {e.by}
              </div>
              <div className="text-parch-ink">
                <Inline text={e.text} />
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {e.ids.map((id) => (
                  <a key={id} href={`#${id}`} className="chip font-mono text-leaf hover:brightness-125">
                    {id}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
