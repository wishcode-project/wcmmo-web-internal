import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { DecisionBadge, DecisionChip, Inline, PocBadge, Progress, RepoChip, SpecBadge, SpecChip } from '../components/ui'
import { decisionById, phaseLabel, pocs, specById, specs } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { fmtDate, timeAgo } from '../../shared/time'
import { strings } from '../strings'
import { NotFound } from './NotFound'

const GITHUB = 'https://github.com/wishcode-project/wcmmo-specs/blob/main/'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-line py-2.5 last:border-0">
      <dt className="text-[11px] tracking-wider text-parch-dim uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-parch-ink">{children}</dd>
    </div>
  )
}

export function SpecDetail() {
  const t = useDict(strings)
  const { id = '' } = useParams()
  const s = specById.get(id)
  if (!s) return <NotFound />

  const idx = specs.indexOf(s)
  const prev = specs[idx - 1]
  const next = specs[idx + 1]
  const citedBy = specs.filter((o) => o.related.includes(s.id)).map((o) => o.id)
  const specPocs = pocs.filter((p) => p.spec === s.id)
  // Drop the H1 and the status quote: the header above shows both.
  const body = s.body.replace(/^#\s.*\n+/, '').replace(/^(>.*\n)+\n*/, '')

  return (
    <>
      <nav className="mb-4 flex items-center gap-2 text-sm text-parch-dim" aria-label="Breadcrumb">
        <Link to="/team/specs" className="hover:text-leaf">
          {t.nav.specs}
        </Link>
        <span aria-hidden>›</span>
        <span className="text-parch-ink">{s.id}</span>
      </nav>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-5xl text-gold drop-shadow-[0_3px_0_#000]">{s.id}</span>
          <SpecBadge status={s.status} />
        </div>
        <h1 className="mt-2 text-3xl text-cream drop-shadow-[0_3px_0_#000] sm:text-4xl">{s.title}</h1>
        {s.doneMeans && (
          <p className="mt-3 max-w-3xl text-parch-dim">
            <span className="font-display text-leaf">{t.spec.doneMeans} </span>
            {s.doneMeans}
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="paper min-w-0 p-5 sm:p-8" lang="en">
          {t.englishSource && <p className="mb-4 border-l-4 border-bark bg-paper-dark/60 px-3 py-2 text-sm text-paper-muted" lang="th">{t.englishSource}</p>}
          <Markdown source={body} basePath={s.path} />
        </article>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <dl className="slate px-4 py-1">
            <Row label={t.spec.phase}>{phaseLabel(s.phase)}</Row>
            <Row label={t.spec.repos}>
              <div className="flex flex-wrap gap-1">
                {s.repos.map((r) => (
                  <RepoChip key={r} repo={r} dark />
                ))}
              </div>
              <p className="mt-1 text-xs text-parch-dim">{s.target}</p>
            </Row>
            <Row label={t.spec.fire}>{s.fireMode || '—'}</Row>
            {s.acceptance.total > 0 && (
              <Row label={t.spec.acceptance}>
                <Progress value={s.acceptance.done} total={s.acceptance.total} label={t.spec.acceptance} />
              </Row>
            )}
            <Row label={t.spec.log}>{s.implLog ? t.spec.runs(s.implLog) : t.spec.notBuilt}</Row>
            <Row label={t.spec.lastChange}>{s.updated ? `${fmtDate(s.updated)} (${timeAgo(s.updated)})` : '—'}</Row>
          </dl>

          {s.decisions.length > 0 && (
            <div className="slate p-4">
              <h2 className="mb-2 text-base text-gold">
                {t.spec.decisions} <span className="text-parch-dim">{t.spec.nOpen(s.blockers.length)}</span>
              </h2>
              <ul className="flex flex-col gap-2">
                {s.decisions.map((d) => {
                  const dec = decisionById.get(d)!
                  return (
                    <li key={d} className="flex items-start gap-2 text-sm">
                      <DecisionChip id={d} dark />
                      <span className="flex-1 text-parch-dim">
                        <Inline text={dec.question} />
                      </span>
                      {dec.status !== 'DECIDED' && <DecisionBadge status={dec.status} dark />}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {specPocs.length > 0 && (
            <div className="slate p-4">
              <h2 className="mb-2 text-base text-gold">{t.spec.pocs}</h2>
              <ul className="flex flex-col gap-2">
                {specPocs.map((p) => (
                  <li key={p.id} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-cream">{p.id}</span>
                      <PocBadge result={p.result} dark />
                    </div>
                    <p className="mt-0.5 text-parch-dim">{p.question}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(s.related.length > 0 || citedBy.length > 0) && (
            <div className="slate p-4">
              <h2 className="mb-2 text-base text-gold">{t.spec.linked}</h2>
              {s.related.length > 0 && (
                <>
                  <p className="text-xs text-parch-dim">{t.spec.mentions}</p>
                  <div className="mt-1 mb-2 flex flex-wrap gap-1">
                    {s.related.map((r) => (
                      <SpecChip key={r} id={r} dark />
                    ))}
                  </div>
                </>
              )}
              {citedBy.length > 0 && (
                <>
                  <p className="text-xs text-parch-dim">{t.spec.mentionedBy}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {citedBy.map((r) => (
                      <SpecChip key={r} id={r} dark />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <a className="btn justify-center" href={GITHUB + s.path} target="_blank" rel="noreferrer">
            {t.common.openOnGithub}
          </a>
        </aside>
      </div>

      <nav className="mt-8 flex justify-between gap-4" aria-label="Spec navigation">
        {prev ? (
          <Link to={`/team/specs/${prev.id}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">◀ {prev.id} {prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/team/specs/${next.id}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">{next.id} {next.title} ▶</span>
          </Link>
        )}
      </nav>
    </>
  )
}
