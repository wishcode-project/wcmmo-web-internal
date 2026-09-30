import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDict, useLang } from '../../shared/i18n'
import { PixelIcon } from '../PixelIcon'
import { categories, enhanceLadder, items, rarities, sampleItem, type ItemCategory } from './items'
import { GuideTitle, Tooltip } from './parts'
import { guideUi } from './ui'

const catIds = Object.keys(categories) as ItemCategory[]

/** The illustration card: identify it, then flip its pages with F (or a click), like in game. */
function SampleCard() {
  const t = useDict(guideUi).it
  const { lang } = useLang()
  const [identified, setIdentified] = useState(false)
  const [page, setPage] = useState(0)
  const rare = rarities.find((r) => r.id === sampleItem.rarity)!
  const p = sampleItem.pages
  const next = () => identified && setPage((n) => (n + 1) % 3)

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={next}
        onKeyDown={(e) => (e.key === 'f' || e.key === 'F') && next()}
        className="w-full max-w-sm text-left"
        aria-label={identified ? t.nextPage(((page + 1) % 3) + 1) : t.unidentified}
      >
        {!identified ? (
          <Tooltip title={`${t.unidentified} Longsword`} color="#9aa0ad">
            <p className="mt-1 text-xs text-[#9aa0ad]">{rare.name[lang]} · ???</p>
            <p className="mt-3 text-[#e8e6ee]">? ? ?</p>
            <p className="mt-3 text-xs text-[#9aa0ad] italic">{t.identifyText.split('.')[0]}.</p>
          </Tooltip>
        ) : (
          <Tooltip title={`${sampleItem.name} ${sampleItem.enhance}`} color={rare.color}>
            <p className="mt-0.5 text-xs" style={{ color: rare.color }}>
              {rare.name[lang]} · {t.pages[page]}
            </p>
            <div className="mt-3 min-h-28 text-sm">
              {page === 0 && (
                <>
                  {p.stats.map((s) => (
                    <div key={s.k.en} className="flex justify-between">
                      <span className="text-[#bfc3cc]">{s.k[lang]}</span>
                      <span className="text-[#8fd14f]">{s.v}</span>
                    </div>
                  ))}
                  <div className="mt-2 text-xs text-[#9aa0ad]">
                    {t.requires}: {p.requires}
                  </div>
                </>
              )}
              {page === 1 &&
                p.upgrades.map((s) => (
                  <div key={s.k.en} className="flex justify-between">
                    <span className="text-[#bfc3cc]">{s.k[lang]}</span>
                    <span className="text-[#ffc94b]">{s.v}</span>
                  </div>
                ))}
              {page === 2 && (
                <>
                  <p className="text-[#c9a7e0] italic">“{p.lore[lang]}”</p>
                  <p className="mt-2 text-xs text-[#9aa0ad]">
                    {t.source}: {p.source[lang]}
                  </p>
                </>
              )}
            </div>
            <p className="mt-3 border-t border-[#3a2a4a] pt-2 text-xs text-[#9aa0ad]">{t.nextPage(page + 1)}</p>
          </Tooltip>
        )}
      </button>
      <div className="flex gap-2">
        {!identified ? (
          <button className="btn btn-leaf" onClick={() => setIdentified(true)}>
            ✦ {t.identifyBtn}
          </button>
        ) : (
          <button
            className="btn"
            onClick={() => {
              setIdentified(false)
              setPage(0)
            }}
          >
            ↺ {t.reset}
          </button>
        )}
      </div>
      <p className="max-w-sm text-center text-[11px] text-paper-muted italic">{t.example}</p>
    </div>
  )
}

export function ItemsPage() {
  const t = useDict(guideUi).it
  const { lang } = useLang()
  const [params, setParams] = useSearchParams()
  const cat = catIds.find((c) => c === params.get('c'))
  const q = params.get('q') ?? ''

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = q.toLowerCase()
    return items.filter(
      (i) => (!cat || i.category === cat) && (!needle || `${i.name.en} ${i.name.th} ${i.type.en} ${i.type.th} ${i.text.en} ${i.text.th}`.toLowerCase().includes(needle)),
    )
  }, [cat, q])

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
            className="w-full border-2 border-bark bg-night px-3 py-2 text-parch-ink placeholder:text-parch-dim/60 focus:border-leaf focus:outline-none md:max-w-xs"
          />
          <div className="flex flex-wrap gap-2" role="group">
            <button className={`btn px-3 py-2 ${!cat ? 'btn-leaf' : ''}`} aria-pressed={!cat} onClick={() => set('c', '')}>
              {t.all} {items.length}
            </button>
            {catIds.map((c) => (
              <button key={c} className={`btn px-3 py-2 ${cat === c ? 'btn-leaf' : ''}`} aria-pressed={cat === c} onClick={() => set('c', c)}>
                <span className="inline-block size-2.5" style={{ background: categories[c].color }} />
                {categories[c].name[lang]} {items.filter((i) => i.category === c).length}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-3 text-sm text-parch-dim">{t.count(list.length)}</p>
        {list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((i) => (
              <Tooltip
                key={i.id}
                title={
                  <span className="flex items-center gap-2">
                    <PixelIcon name={i.icon} className="size-7 shrink-0" />
                    {i.name[lang]}
                  </span>
                }
                color={categories[i.category].color}
                className="h-full"
              >
                <div className="mt-0.5 text-xs text-[#9aa0ad]">{i.type[lang]}</div>
                <p className="mt-2 text-[#e8e6ee]">{i.text[lang]}</p>
                {i.source && (
                  <p className="mt-2 text-xs text-[#88cc42]">
                    {t.source}: {i.source[lang]}
                  </p>
                )}
              </Tooltip>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-parch-dim italic">{t.none}</p>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="paper min-w-0 p-5">
          <GuideTitle>{t.rarity}</GuideTitle>
          <p className="mb-3 text-sm text-paper-muted">{t.rarityText}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-bark text-left font-display text-cream">
                  <th className="px-3 py-2 font-normal">{t.rName}</th>
                  <th className="px-3 py-2 font-normal">{t.lines}</th>
                  <th className="px-3 py-2 font-normal">{t.roll}</th>
                  <th className="px-3 py-2 font-normal">{t.element}</th>
                  <th className="px-3 py-2 font-normal">{t.weight}</th>
                </tr>
              </thead>
              <tbody>
                {rarities.map((r) => (
                  <tr key={r.id} className="border-b border-bark/25">
                    <td className="px-3 py-2">
                      <span className="bg-[#120812] px-2 py-0.5 font-display" style={{ color: r.color }}>
                        {r.name[lang]}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-display text-bark-dark">{r.lines}</td>
                    <td className="px-3 py-2 font-mono">{r.roll}</td>
                    <td className="px-3 py-2 font-mono">{r.element}</td>
                    <td className="px-3 py-2">
                      <span className="block h-2 bg-bark/20">
                        <span className="block h-full" style={{ width: `${r.weight}%`, background: r.color, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.3)' }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="paper min-w-0 p-5">
          <GuideTitle>{t.identify}</GuideTitle>
          <p className="mb-4 text-sm text-paper-muted">{t.identifyText}</p>
          <SampleCard />
        </div>
      </section>

      <section className="paper p-5">
        <GuideTitle>{t.enhance}</GuideTitle>
        <p className="mb-4 text-sm text-paper-muted">{t.enhanceText}</p>
        <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-9">
          {enhanceLadder.map((s) => (
            <li key={s.stage} className="flex flex-col bg-bark-dark p-3 text-center shadow-[inset_0_0_0_2px_var(--color-bark)]">
              <span className="font-display text-lg text-gold">{s.stage}</span>
              <span className="mt-2 flex h-16 w-full items-end bg-black/40" aria-hidden>
                <span className="block w-full bg-leaf shadow-[inset_0_-3px_0_#4f7d22]" style={{ height: `${s.success}%` }} />
              </span>
              <span className="mt-2 font-display text-sm text-cream">{s.label}</span>
              <span className="text-[11px] text-paper-light/70">{s.fail[lang]}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 font-display text-bark-dark">✔ {t.neverBreaks}</p>
      </section>
    </div>
  )
}
