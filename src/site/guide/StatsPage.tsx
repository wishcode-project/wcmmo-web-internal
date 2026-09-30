import { useDict, useLang } from '../../shared/i18n'
import { PixelIcon } from '../PixelIcon'
import { attributes, powerSources, requirementLadder } from './data'
import { GuideTitle } from './parts'
import { guideUi } from './ui'

export function StatsPage() {
  const t = useDict(guideUi).st
  const { lang } = useLang()
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-xl text-cream">{t.sources}</h2>
        <p className="mb-3 text-sm text-parch-dim">{t.sourcesText}</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {powerSources.map((p) => (
            <li key={p.system.en} className="slate flex flex-col items-center gap-2 p-4 text-center">
              <PixelIcon name={p.icon} className="size-10" />
              <span className="font-display text-cream">{p.system[lang]}</span>
              <span className="text-xs text-parch-dim">→ {p.gives[lang]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-xl text-cream">{t.attributes}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attributes.map((a) => (
            <article key={a.id} className="paper flex gap-4 p-5">
              <span
                className="grid size-16 shrink-0 place-items-center bg-bark-dark font-display text-2xl uppercase"
                style={{ color: a.color, boxShadow: `inset 0 0 0 3px ${a.color}` }}
              >
                {a.id}
              </span>
              <div className="min-w-0 text-sm">
                <h3 className="text-lg text-bark-dark">{a.name[lang]}</h3>
                <p className="mt-1">
                  <span className="font-medium text-bark-dark">{t.gates}:</span> {a.gates[lang]}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-bark-dark">{t.bonus}:</span> {a.bonus[lang]}
                </p>
                <p className="mt-1 text-paper-muted">
                  <span className="font-medium">{t.never}:</span> {a.never[lang]}
                </p>
              </div>
            </article>
          ))}
          <article className="slate p-5">
            <h3 className="font-display text-lg text-gold">{t.points}</h3>
            <dl className="mt-2 flex flex-col gap-2 text-sm">
              {t.pointsRows.map((r) => (
                <div key={r.label} className="flex justify-between gap-3 border-b border-slate-line pb-2">
                  <dt className="text-parch-dim">{r.label}</dt>
                  <dd className="text-right font-display text-cream">{r.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <section className="paper p-5">
        <GuideTitle>{t.ladder}</GuideTitle>
        <p className="mb-3 text-sm text-paper-muted">{t.ladderText}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="bg-bark text-left font-display text-cream">
                <th className="px-3 py-2 font-normal">{t.gear}</th>
                <th className="px-3 py-2 font-normal">{t.low}</th>
                <th className="px-3 py-2 font-normal">{t.mid}</th>
                <th className="px-3 py-2 font-normal">{t.high}</th>
              </tr>
            </thead>
            <tbody>
              {requirementLadder.map((r) => (
                <tr key={r.gear.en} className="border-b border-bark/25 even:bg-paper-light/50">
                  <td className="px-3 py-2 font-medium text-bark-dark">{r.gear[lang]}</td>
                  <td className="px-3 py-2 font-mono">{r.low}</td>
                  <td className="px-3 py-2 font-mono">{r.mid}</td>
                  <td className="px-3 py-2 font-mono">{r.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
