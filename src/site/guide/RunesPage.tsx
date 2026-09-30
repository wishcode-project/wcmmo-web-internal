import { useSearchParams } from 'react-router-dom'
import { useDict, useLang } from '../../shared/i18n'
import { PixelIcon } from '../PixelIcon'
import { runeCaps, runeGroups, runes, type RuneGroup } from './data'
import { GuideTitle, Tooltip } from './parts'
import { guideUi } from './ui'

const groupIds = Object.keys(runeGroups) as RuneGroup[]

export function RunesPage() {
  const t = useDict(guideUi).rn
  const { lang } = useLang()
  const [params, setParams] = useSearchParams()
  const g = groupIds.find((x) => x === params.get('g'))
  const list = runes.filter((r) => !g || r.group === g)

  return (
    <div className="flex flex-col gap-8">
      <section className="paper grid gap-5 p-5 md:grid-cols-2">
        <div>
          <GuideTitle>{t.slots}</GuideTitle>
          <ol className="flex items-center gap-2">
            {t.slotsSteps.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="bg-bark-dark px-3 py-2 text-center shadow-[inset_0_0_0_2px_var(--color-bark)]">
                  <span className="block text-[11px] text-paper-light">{s.label}</span>
                  <span className="block font-display text-cream">{s.value}</span>
                </span>
                {i < t.slotsSteps.length - 1 && <span className="font-display text-bark">▶</span>}
              </li>
            ))}
          </ol>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {t.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap gap-2" role="group">
          <button className={`btn px-3 py-2 ${!g ? 'btn-leaf' : ''}`} aria-pressed={!g} onClick={() => setParams({}, { replace: true })}>
            {t.all} {runes.length}
          </button>
          {groupIds.map((id) => (
            <button key={id} className={`btn gap-2 px-3 py-2 ${g === id ? 'btn-leaf' : ''}`} aria-pressed={g === id} onClick={() => setParams({ g: id }, { replace: true })}>
              <PixelIcon name={runeGroups[id].icon} className="size-5" />
              {runeGroups[id].name[lang]} {runes.filter((r) => r.group === id).length}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((r) => {
            const grp = runeGroups[r.group]
            return (
              <Tooltip
                key={r.name}
                title={
                  <span className="flex items-center gap-2">
                    <PixelIcon name={grp.icon} className="size-7" />
                    {r.name}
                  </span>
                }
                color={grp.color}
                className="h-full"
              >
                <div className="mt-0.5 text-xs" style={{ color: grp.color }}>
                  {grp.name[lang]}
                </div>
                <p className="mt-2 text-[#e8e6ee]">{r.stat[lang]}</p>
                <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                  {r.tiers.map((v, i) => (
                    <span key={i} className="bg-black/40 px-1 py-1 shadow-[inset_0_0_0_1px_#3a2a4a]">
                      <span className="block text-[10px] text-[#9aa0ad]">{['I', 'II', 'III'][i]}</span>
                      <span className="font-display text-[#e8e6ee]">{v}</span>
                    </span>
                  ))}
                </div>
                {r.slice && <div className="mt-2 text-[11px] text-[#88cc42]">★ {t.firstVersion}</div>}
              </Tooltip>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="paper p-5">
          <GuideTitle>{t.caps}</GuideTitle>
          <p className="mb-3 text-sm text-paper-muted">{t.capsText}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bark text-left font-display text-cream">
                <th className="px-3 py-2 font-normal">{t.capStat}</th>
                <th className="px-3 py-2 font-normal">{t.cap}</th>
                <th className="px-3 py-2 font-normal">{t.sharedWith}</th>
              </tr>
            </thead>
            <tbody>
              {runeCaps.map((c) => (
                <tr key={c.cap + c.stat.en} className="border-b border-bark/25">
                  <td className="px-3 py-2">{c.stat[lang]}</td>
                  <td className="px-3 py-2 font-display text-bark-dark">{c.cap}</td>
                  <td className="px-3 py-2 text-paper-muted">{c.with[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="paper p-5">
          <GuideTitle>{t.sources}</GuideTitle>
          <ul className="flex flex-col gap-2">
            {t.sourceRows.map((s) => (
              <li key={s.tier} className="flex items-center gap-3 text-sm">
                <span className="grid size-10 shrink-0 place-items-center bg-bark-dark font-display text-gold shadow-[inset_0_0_0_2px_var(--color-bark)]">{s.tier}</span>
                <span>{s.where}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
