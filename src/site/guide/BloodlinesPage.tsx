import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDict, useLang } from '../../shared/i18n'
import { PixelIcon } from '../PixelIcon'
import { bloodlines, stageUnlock, type Bloodline, type StageNode } from './data'
import { Rating, Stone, Tooltip } from './parts'
import { guideUi } from './ui'

function Selector({ current }: { current: Bloodline }) {
  const t = useDict(guideUi).bl
  const { lang } = useLang()
  return (
    <aside className="order-first grid grid-cols-3 gap-2 lg:order-none lg:flex lg:flex-col lg:gap-3" aria-label={t.choose}>
      {bloodlines.map((b) => {
        const on = b.id === current.id
        return (
          <Link
            key={b.id}
            to={`?b=${b.id}`}
            replace
            aria-current={on ? 'page' : undefined}
            className={`paper flex flex-col items-center gap-2 p-2 text-center transition hover:-translate-y-0.5 sm:flex-row sm:gap-3 sm:p-3 sm:text-left ${on ? 'outline-3 outline-gold' : 'opacity-90 hover:opacity-100'}`}
          >
            <span className="grid size-12 shrink-0 place-items-center bg-bark-dark sm:size-16" style={{ boxShadow: `inset 0 0 0 3px ${b.color}` }}>
              <PixelIcon name={b.icon} className="size-8 sm:size-11" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg text-bark-dark">{b.name}</span>
              <span className="hidden truncate text-xs text-paper-muted sm:block">{b.tagline[lang]}</span>
              <span className="mt-1.5 hidden sm:block">
                <Rating label={t.difficulty} value={b.ratings.difficulty} color={b.color} />
              </span>
            </span>
          </Link>
        )
      })}
    </aside>
  )
}

function StageTree({ b }: { b: Bloodline }) {
  const t = useDict(guideUi).bl
  const { lang } = useLang()
  const [picked, setPicked] = useState<StageNode | null>(b.nodes[0])
  const stages = [1, 2, 3, 4, 5] as const

  const node = (n: StageNode) => {
    const on = picked === n
    return (
      <button
        key={n.name}
        onClick={() => setPicked(n)}
        aria-pressed={on}
        className="flex min-w-0 items-center gap-2 px-3 py-2 text-left transition"
        style={{
          background: on ? '#3d4048' : '#1f2025',
          boxShadow: `inset 0 0 0 2px ${on ? b.color : '#4a4d55'}`,
        }}
      >
        <span className="grid size-8 shrink-0 place-items-center bg-black/40" style={{ boxShadow: `inset 0 0 0 1px ${b.color}` }}>
          <PixelIcon name={b.icon} className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm text-[#e8e6ee]">{n.name}</span>
          <span className="block text-[11px] text-[#9aa0ad]">{n.path === 'fixed' ? (n.active ? t.active : t.fixed) : t.path(n.path)}</span>
        </span>
      </button>
    )
  }

  return (
    <Stone>
      <h2 className="text-center font-display text-lg text-[#e8e6ee]">{t.tree}</h2>
      <p className="mx-auto mt-1 max-w-xl text-center text-xs text-[#9aa0ad]">{t.treeIntro}</p>
      <ol className="relative mt-5 flex flex-col gap-3">
        {/* spine */}
        <span aria-hidden className="absolute top-4 bottom-4 left-1/2 w-1 -translate-x-1/2 bg-[#1b1c20]" />
        {stages.map((s) => {
          const ns = b.nodes.filter((n) => n.stage === s)
          return (
            <li key={s} className="relative">
              <div className="mb-1.5 text-center">
                <span className="relative bg-[#2d2f35] px-2 font-display text-xs text-gold">
                  {t.stage(s)} · {stageUnlock[s][lang]}
                </span>
              </div>
              <div className={`relative mx-auto grid gap-3 ${ns.length > 1 ? 'max-w-lg grid-cols-2' : 'max-w-[15rem] grid-cols-1'}`}>{ns.map(node)}</div>
            </li>
          )
        })}
      </ol>
      <div className="mt-5" aria-live="polite">
        {picked ? (
          <Tooltip title={picked.name} color={b.color} className="mx-auto max-w-lg">
            <div className="mt-0.5 text-xs text-[#9aa0ad]">
              {t.stage(picked.stage)} · {picked.path === 'fixed' ? (picked.active ? t.active : t.fixed) : t.path(picked.path)} · {stageUnlock[picked.stage][lang]}
            </div>
            <p className="mt-2 text-[#e8e6ee]">{picked.text[lang]}</p>
          </Tooltip>
        ) : (
          <p className="text-center text-sm text-[#9aa0ad]">{t.pick}</p>
        )}
      </div>
    </Stone>
  )
}

export function BloodlinesPage() {
  const t = useDict(guideUi).bl
  const { lang } = useLang()
  const [params] = useSearchParams()
  const b = bloodlines.find((x) => x.id === params.get('b')) ?? bloodlines[0]
  const r = b.ratings

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-5">
        <section className="paper grid gap-6 p-5 sm:p-7 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <div className="grid size-48 place-items-center bg-bark-dark" style={{ boxShadow: `inset 0 0 0 4px ${b.color}, 0 0 0 3px var(--color-bark-dark), 0 8px 0 rgb(0 0 0 / 0.3)` }}>
              <PixelIcon name={b.icon} className="size-36" />
            </div>
            <span className="chip border-bark/60 font-display text-bark">{t.of(b.name)}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-3xl" style={{ color: b.ink }}>
              {b.name}
            </h2>
            <p className="font-display text-bark-dark">{b.tagline[lang]}</p>
            <div className="pixel-divider my-3 opacity-50" />
            <p className="leading-relaxed">{b.about[lang]}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              {[
                [t.playsLike, b.playsLike[lang]],
                [t.best, b.best[lang]],
                [t.weakness, b.weakness[lang]],
              ].map(([k, v]) => (
                <div key={k} className="bg-paper-light/60 px-3 py-2 shadow-[inset_0_0_0_1px_rgb(96_76_57_/_0.3)]">
                  <dt className="text-[11px] tracking-wider text-paper-muted uppercase">{k}</dt>
                  <dd className="font-medium text-bark-dark">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 grid gap-3 bg-paper-light/50 p-4 shadow-[inset_0_0_0_1px_rgb(96_76_57_/_0.3)] sm:grid-cols-2">
              <Rating label={t.ratings.difficulty} value={r.difficulty} color={b.color} />
              <Rating label={t.ratings.damage} value={r.damage} color={b.color} />
              <Rating label={t.ratings.defence} value={r.defence} color={b.color} />
              <Rating label={t.ratings.recovery} value={r.recovery} color={b.color} />
              <Rating label={t.ratings.support} value={r.support} color={b.color} />
              <p className="self-end text-[11px] text-paper-muted italic">{t.ratingsNote}</p>
            </div>
          </div>
        </section>

        {/* key on the Bloodline so the tree resets to stage 1 when you switch */}
        <StageTree key={b.id} b={b} />

        <section className="paper p-5">
          <h2 className="text-lg text-bark-dark">{t.howGet}</h2>
          <p className="mt-1 text-sm">{t.howGetText}</p>
        </section>
      </div>
      <Selector current={b} />
    </div>
  )
}
