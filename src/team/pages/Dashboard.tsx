import { Link } from 'react-router-dom'
import { DecisionsByArea, SpecActivity, SpecBlockers } from '../components/charts'
import { HeroArt } from '../../shared/HeroArt'
import { PocBadge, Progress, SectionTitle, SpecBadge, StatTile, specStatusColor } from '../components/ui'
import { counts, decisionLog, decisions, meta, phases, pocs, SPEC_STATUSES, sliceWindow, specs } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { daysBetween, fmtDate, fmtShort, timeAgo } from '../../shared/time'
import { strings } from '../strings'

function SliceCountdown() {
  const t = useDict(strings).dash
  if (!sliceWindow) return null
  const today = new Date()
  const total = daysBetween(sliceWindow.start, sliceWindow.late)
  const elapsed = Math.min(Math.max(daysBetween(sliceWindow.start, today), 0), total)
  const toEarly = daysBetween(today, sliceWindow.early)
  const toLate = daysBetween(today, sliceWindow.late)
  const earlyPct = (daysBetween(sliceWindow.start, sliceWindow.early) / total) * 100
  return (
    <div className="paper w-full max-w-md p-5">
      <p className="font-display text-sm tracking-widest text-bark uppercase">{t.slice}</p>
      <p className="mt-1 font-display text-3xl text-bark-dark">
        {toLate < 0 ? t.passed : t.days(toEarly > 0 ? toEarly : toLate)}
        <span className="ml-2 text-base text-paper-muted">{toLate < 0 ? '' : toEarly > 0 ? t.toEarly : t.toLate}</span>
      </p>
      <div className="relative mt-4">
        <div className="bar-track h-3">
          <div className="bar-fill" style={{ width: `${(elapsed / total) * 100}%` }} />
        </div>
        <span className="absolute -top-1 h-5 w-0.5 bg-bark-dark" style={{ left: `${earlyPct}%` }} title={t.toEarly} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-paper-muted">
        <span>
          {t.start} {fmtShort(sliceWindow.start)}
        </span>
        <span>
          {t.wk2} {fmtShort(sliceWindow.early)}
        </span>
        <span>
          {t.wk3} {fmtShort(sliceWindow.late)}
        </span>
      </div>
      <p className="mt-3 text-xs text-paper-muted">
        {t.dayOf(elapsed, total)}
      </p>
    </div>
  )
}

function Hero() {
  const t = useDict(strings).dash
  return (
    <section className="relative left-1/2 -mt-6 mb-10 w-screen -translate-x-1/2 overflow-hidden sm:-mt-10">
      <HeroArt className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-14 pb-10 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-sm tracking-[0.3em] text-leaf uppercase drop-shadow-[0_2px_0_#000]">{t.kicker}</p>
          <h1 className="mt-2 text-5xl text-cream drop-shadow-[0_4px_0_rgb(0_0_0_/_0.7)] sm:text-6xl">{t.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-paper-lighter drop-shadow-[0_2px_0_#000]">
            {t.intro} <code className="font-mono text-gold">wcmmo-specs</code>
            {t.intro2}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/team/specs" className="btn btn-leaf">
              ▶ {t.browse}
            </Link>
            <Link to="/team/graph" className="btn">
              ⛓ {t.graph}
            </Link>
          </div>
          <p className="mt-4 text-xs text-parch-dim">
            {t.lastCommit(timeAgo(meta.commits[0]?.date), timeAgo(meta.syncedAt))}
          </p>
        </div>
        <SliceCountdown />
      </div>
    </section>
  )
}

function Pipeline() {
  const t = useDict(strings).dash
  const none = useDict(strings).common.noneYet
  const cols = SPEC_STATUSES.filter((s) => s !== 'SUPERSEDED' || counts.specsByStatus.SUPERSEDED)
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cols.map((st) => {
        const list = specs.filter((s) => s.status === st)
        return (
          <div key={st} className="slate flex flex-col p-3">
            <div className="flex items-center justify-between border-b border-slate-line pb-2">
              <SpecBadge status={st} dark />
              <span className="font-display text-2xl text-cream tabular-nums">{list.length}</span>
            </div>
            <ul className="mt-2 flex max-h-72 flex-col gap-1 overflow-y-auto pr-1">
              {list.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/team/specs/${s.id}`}
                    className="flex items-center gap-2 px-2 py-1 text-sm text-parch-ink hover:bg-white/5"
                    style={{ boxShadow: `inset 3px 0 0 ${specStatusColor[st]}` }}
                  >
                    <span className="font-mono text-xs text-parch-dim">{s.id}</span>
                    <span className="truncate">{s.title}</span>
                    {s.status === 'DRAFT' && (
                      <span className={`ml-auto shrink-0 font-mono text-[11px] ${s.blockers.length ? 'text-st-open' : 'text-st-done'}`} title="open decisions cited">
                        {s.blockers.length ? t.open(s.blockers.length) : t.unblocked}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              {!list.length && <li className="px-2 py-3 text-sm text-parch-dim italic">{none}</li>}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export function Dashboard() {
  const t = useDict(strings).dash
  const recent = [
    ...meta.commits.slice(0, 6).map((c) => ({ date: c.date, kind: 'commit' as const, text: c.subject, ref: c.sha })),
    ...decisionLog.map((d) => ({ date: d.date, kind: 'decision' as const, text: d.text, ref: d.ids.join(', ') })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  return (
    <>
      <Hero />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-label="Headline numbers">
        <StatTile label={t.tiles.specsDone} value={counts.specsByStatus.DONE} of={counts.specs} />
        <StatTile label={t.tiles.decisions} value={counts.decided} of={decisions.length} hint={t.tiles.stillOpen(counts.decisionsOpen)} />
        <StatTile label={t.tiles.pocs} value={counts.pocsPassed} of={pocs.length} accent="var(--color-st-ready)" />
        <StatTile label={t.tiles.acceptance} value={counts.acceptanceDone} of={counts.acceptanceTotal} />
        <StatTile label={t.tiles.questions} value={counts.questionsPending} hint={t.tiles.pending} accent="var(--color-st-open)" />
      </section>

      <section className="mt-10">
        <SectionTitle aside={<Link to="/team/specs" className="text-sm text-leaf hover:underline">{t.allSpecs}</Link>}>{t.pipeline}</SectionTitle>
        <p className="mb-3 max-w-3xl text-sm text-parch-dim">
          {t.pipelineHelp1} {t.pipelineHelp2(counts.readyable)}
        </p>
        <Pipeline />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle aside={<Link to="/team/decisions" className="text-sm text-leaf hover:underline">{t.decisionsLink}</Link>}>{t.byArea}</SectionTitle>
          <div className="slate p-4">
            <DecisionsByArea />
          </div>
        </div>
        <div>
          <SectionTitle aside={<Link to="/team/graph" className="text-sm text-leaf hover:underline">{t.graphLink}</Link>}>{t.blocks}</SectionTitle>
          <div className="slate p-4">
            <p className="mb-2 text-xs text-parch-dim">{t.blocksHelp}</p>
            <SpecBlockers />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionTitle aside={<Link to="/team/roadmap" className="text-sm text-leaf hover:underline">{t.roadmapLink}</Link>}>{t.phases}</SectionTitle>
          <div className="paper p-5">
            <ol className="flex flex-col gap-4">
              {phases.map((p) => {
                const ps = p.specs.map((id) => specs.find((s) => s.id === id)).filter((s) => !!s)
                const done = ps.filter((s) => s.status === 'DONE').length
                return (
                  <li key={p.key}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg text-bark-dark">
                        {t.phase(p.n, p.name)}
                      </span>
                      <span className="text-xs text-paper-muted">{ps.length ? t.nSpecs(ps.length) : t.notSpecced}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-paper-muted">{p.goal}</p>
                    {ps.length > 0 && (
                      <div className="mt-1.5">
                        <Progress value={done} total={ps.length} label={t.phase(p.n, p.name)} />
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
        <div className="lg:col-span-2">
          <SectionTitle>{t.pocs}</SectionTitle>
          <ul className="slate divide-y divide-slate-line">
            {pocs.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                <span className="w-14 shrink-0 font-display text-gold">{p.id}</span>
                <span className="flex-1 text-sm text-parch-ink">{p.question}</span>
                <PocBadge result={p.result} dark />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle>{t.activity}</SectionTitle>
          <div className="slate p-4">
            <SpecActivity />
          </div>
        </div>
        <div>
          <SectionTitle>{t.recent}</SectionTitle>
          <ol className="slate divide-y divide-slate-line">
            {recent.map((r, i) => (
              <li key={i} className="flex gap-3 px-3 py-2 text-sm">
                <span className="w-16 shrink-0 text-xs text-parch-dim">{fmtShort(r.date)}</span>
                <span className={`w-16 shrink-0 font-display text-xs ${r.kind === 'decision' ? 'text-leaf' : 'text-gold'}`}>{r.kind === 'decision' ? t.decision : t.commit}</span>
                <span className="flex-1 text-parch-ink">
                  {r.text.replace(/`/g, '')} <span className="font-mono text-xs text-parch-dim">{r.ref}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-parch-dim">{t.lastSynced(fmtDate(meta.syncedAt))}</p>
        </div>
      </section>
    </>
  )
}
