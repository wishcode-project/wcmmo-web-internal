import { Link } from 'react-router-dom'
import { DecisionChip, Inline, PageHeader, PocBadge, Progress, SectionTitle, SpecChip, specStatusColor } from '../components/ui'
import { phases, pocs, prereqs, sliceWindow, specById } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { daysBetween, fmtDate } from '../../shared/time'
import { strings } from '../strings'

function Timeline() {
  const t = useDict(strings).roadmap
  if (!sliceWindow) return null
  const { start } = sliceWindow
  const today = new Date()
  const days = daysBetween(start, sliceWindow.late)
  const cells = Array.from({ length: days + 1 }, (_, i) => new Date(start.getTime() + i * 86_400_000))
  const todayIdx = daysBetween(sliceWindow.start, today)
  const earlyIdx = daysBetween(sliceWindow.start, sliceWindow.early)
  return (
    <div className="slate p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg text-cream">{t.window}</p>
        <p className="text-sm text-parch-dim">
          {fmtDate(sliceWindow.start)} → {fmtDate(sliceWindow.early)} (2 wk) / {fmtDate(sliceWindow.late)} (3 wk)
        </p>
      </div>
      <ol className="mt-3 grid grid-cols-11 gap-1 sm:grid-cols-[repeat(22,minmax(0,1fr))]" aria-label={t.window}>
        {cells.map((d, i) => {
          const past = i < todayIdx
          const isToday = i === todayIdx
          const inEarly = i <= earlyIdx
          return (
            <li
              key={i}
              title={`${fmtDate(d)}${isToday ? ` (${t.today})` : ''}${i === 7 ? ` · ${t.recheck}` : ''}`}
              className="flex aspect-square flex-col items-center justify-center text-[10px]"
              style={{
                background: past ? 'var(--color-leaf-dark)' : inEarly ? 'rgb(136 204 66 / 0.14)' : 'rgb(255 201 75 / 0.1)',
                boxShadow: isToday ? '0 0 0 2px var(--color-gold)' : i === 7 ? 'inset 0 -3px 0 var(--color-st-open)' : undefined,
                color: past ? 'var(--color-cream)' : 'var(--color-parch-dim)',
              }}
            >
              <span className="font-display">{d.getDate()}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-xs text-parch-dim">{t.legend}</p>
    </div>
  )
}

export function Roadmap() {
  const t = useDict(strings)
  const r = t.roadmap
  return (
    <>
      <PageHeader kicker={r.kicker} title={r.title}>
        {r.intro1}{' '}
        <Link to="/team/specs/004" className="text-leaf underline">
          004 Roadmap &amp; Phase 0 PoCs
        </Link>
        .
      </PageHeader>

      <Timeline />

      <section className="mt-10">
        <SectionTitle>{r.phases}</SectionTitle>
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {phases.map((p) => {
            const list = p.specs.map((id) => specById.get(id)).filter((s) => !!s)
            const done = list.filter((s) => s.status === 'DONE').length
            return (
              <li key={p.key} className="paper flex flex-col p-5">
                <p className="font-display text-sm tracking-widest text-bark uppercase">{r.phase(p.n)}</p>
                <h3 className="text-xl text-bark-dark">{p.name}</h3>
                <p className="mt-2 text-sm">
                  <Inline text={p.goal} />
                </p>
                <p className="mt-2 text-sm text-paper-muted">
                  <span className="font-medium">{r.exit}</span>
                  <Inline text={p.exit} />
                </p>
                <div className="mt-auto pt-4">
                  {list.length > 0 ? (
                    <>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {list.map((s) => (
                          <Link key={s.id} to={`/team/specs/${s.id}`} className="chip font-mono text-paper-text" style={{ boxShadow: `inset 3px 0 0 ${specStatusColor[s.status]}` }} title={`${s.title} · ${s.status}`}>
                            {s.id}
                          </Link>
                        ))}
                      </div>
                      <Progress value={done} total={list.length} label={r.phase(p.n)} />
                    </>
                  ) : (
                    <p className="text-sm text-paper-muted italic">{r.notSpecced}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section id="pocs" className="mt-10 scroll-mt-24">
        <SectionTitle>{r.pocs}</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-2">
          {pocs.map((p) => (
            <article key={p.id} className="slate p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-2xl text-gold">{p.id}</span>
                <PocBadge result={p.result} dark />
              </div>
              <h3 className="mt-1 font-sans text-base font-bold tracking-normal text-cream">{p.question}</h3>
              <dl className="mt-3 grid gap-2 text-sm">
                <div>
                  <dt className="text-[11px] tracking-wider text-st-done uppercase">{r.passWhen}</dt>
                  <dd className="text-parch-ink">
                    <Inline text={p.pass} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-wider text-st-ready uppercase">{r.fallback}</dt>
                  <dd className="text-parch-ink">
                    <Inline text={p.fallback} />
                  </dd>
                </div>
                {p.notes && (
                  <div>
                    <dt className="text-[11px] tracking-wider text-parch-dim uppercase">{r.notes(p.date)}</dt>
                    <dd className="text-parch-ink">
                      <Inline text={p.notes} />
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-3 flex flex-wrap items-center gap-1">
                <SpecChip id={p.spec} dark />
                {p.decisions.map((d) => (
                  <DecisionChip key={d} id={d} dark />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>{r.prereqs}</SectionTitle>
        <ul className="paper divide-y divide-bark/25 px-5 py-2">
          {prereqs.map((p) => (
            <li key={p.id} className="flex flex-wrap items-start gap-3 py-3">
              <span className="w-8 font-display text-lg text-bark-dark">{p.id}</span>
              <span className="min-w-0 flex-1 text-sm">
                <Inline text={p.item} />
              </span>
              <span className="text-xs text-paper-muted">
                {p.repo !== '—' && <code className="font-mono">{p.repo}</code>} · {p.owner}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
