import { Link } from 'react-router-dom'
import { DecisionChip, Inline, PageHeader, SectionTitle, SpecChip } from '../components/ui'
import { answered, answeredOn, decisionById, ownerQuestions, pluginChecklist, team } from '../lib/data'
import { decisionRefs } from '../lib/markdown'
import { useDict } from '../../shared/i18n'
import { strings } from '../strings'

const groups = [...new Set(ownerQuestions.map((q) => q.group))]

function Refs({ text }: { text: string }) {
  const ds = decisionRefs(text).filter((d) => decisionById.has(d))
  const spec = /^\d{3}$/.test(text.trim()) ? text.trim() : null
  if (!ds.length && !spec) return <span className="text-xs text-parch-dim">{text === '—' ? '' : text}</span>
  return (
    <span className="flex flex-wrap gap-1">
      {spec && <SpecChip id={spec} dark />}
      {ds.map((d) => (
        <DecisionChip key={d} id={d} dark />
      ))}
    </span>
  )
}

export function Questions() {
  const t = useDict(strings)
  const q = t.questions
  const pending = ownerQuestions.filter((q) => !q.answered)
  return (
    <>
      <PageHeader kicker="gdd/owner-questions.md" title={q.title}>
        {q.intro}
      </PageHeader>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {team.map((t) => (
          <div key={t.person} className="paper p-4">
            <p className="font-display text-xl text-bark-dark">{t.person}</p>
            <p className="text-sm">
              <Inline text={t.role} />
            </p>
            <p className="mt-1 text-xs text-paper-muted">
              <Inline text={t.owns} />
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {groups.map((g) => {
          const qs = ownerQuestions.filter((q) => q.group === g)
          const open = qs.filter((q) => !q.answered).length
          return (
            <section key={g}>
              <SectionTitle aside={<span className="text-sm text-parch-dim">{q.pending(open)}</span>}>
                <span className="capitalize">{g}</span>
              </SectionTitle>
              <ul className="slate divide-y divide-slate-line">
                {qs.map((item) => (
                  <li key={item.id} className={`flex gap-3 px-4 py-3 ${item.answered ? 'opacity-50' : ''}`}>
                    <span className="w-10 shrink-0 font-display text-gold">{item.id}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-parch-ink" lang="en">
                        <Inline text={item.question} />
                      </p>
                      <div className="mt-1.5">
                        <Refs text={item.ref} />
                      </div>
                    </div>
                    {item.answered && <span className="chip h-fit font-display text-st-done">✔ {q.answered}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {pluginChecklist.rows.length > 0 && (
        <section className="mt-10">
          <SectionTitle aside={<Link to="/team/plugins" className="text-sm text-leaf hover:underline">{q.pluginsLink}</Link>}>{q.pluginFill}</SectionTitle>
          <div className="paper overflow-x-auto p-2">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  {pluginChecklist.headers.map((h) => (
                    <th key={h} className="bg-bark px-3 py-2 text-left font-display font-normal text-cream">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pluginChecklist.rows.map((r) => {
                  const filled = r.slice(1).filter((c) => c).length
                  return (
                    <tr key={r[0]} className="border-b border-bark/25">
                      {r.map((c, i) => (
                        <td key={i} className={`px-3 py-2 ${i === 0 ? 'font-medium' : ''}`}>
                          {c ? <Inline text={c} /> : <span className="text-paper-muted/60">·</span>}
                        </td>
                      ))}
                      <td className="sr-only">{filled} fields filled</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-10">
        <SectionTitle aside={<span className="text-sm text-parch-dim">{answeredOn}</span>}>{q.answeredTitle}</SectionTitle>
        <ul className="paper divide-y divide-bark/25 px-5 py-2">
          {answered.map((a) => (
            <li key={a.topic} className="grid gap-1 py-3 sm:grid-cols-[220px_minmax(0,1fr)_140px] sm:gap-4">
              <span className="font-medium text-bark-dark">
                <Inline text={a.topic} />
              </span>
              <span className="text-sm">
                <Inline text={a.answer} />
              </span>
              <span className="text-xs text-paper-muted">
                <Inline text={a.where} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm text-parch-dim">{q.total(pending.length)}</p>
    </>
  )
}
