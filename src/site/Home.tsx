import { Link } from 'react-router-dom'
import { HeroArt } from '../shared/HeroArt'
import { useDict, useLang } from '../shared/i18n'
import { timeAgo } from '../shared/time'
import { comingLater, copy, features, site, ui } from './config'
import { chapters, chapterText, posts, stageProgress, stats } from './content'
import { storyImage } from '../shared/story'
import { PixelIcon } from './PixelIcon'
import { PostCard, SectionHeading, ServerPlate, StageCard } from './parts'
import { Wordmark } from './PublicLayout'

function Hero() {
  const t = useDict(ui)
  const c = useDict(copy)
  return (
    <section className="relative isolate overflow-hidden">
      <HeroArt className="absolute inset-0 -z-10 h-full w-full" twinkle />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-night" />
      <div className="mx-auto flex min-h-[78dvh] max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-24 text-center">
        <h1 className="sr-only">{site.name}</h1>
        <Wordmark size="xl" />
        <p className="mt-5 max-w-xl font-display text-xl text-cream drop-shadow-[0_2px_0_#000] sm:text-2xl">{c.tagline}</p>
        <p className="mt-2 font-display text-sm text-paper-light drop-shadow-[0_2px_0_#000]">🌐 {c.languages}</p>
        <div className="mt-8">
          <ServerPlate />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/features" className="btn btn-leaf px-5 py-2 text-base">
            ▶ {t.discover}
          </Link>
          <Link to="/devlog" className="btn px-5 py-2 text-base">
            ✎ {t.readDevlog}
          </Link>
          {site.discordUrl && (
            <a href={site.discordUrl} className="btn px-5 py-2 text-base" target="_blank" rel="noreferrer">
              ✦ Discord
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

const percent = (done: number, total: number) => Math.round((done / Math.max(total, 1)) * 100)

/** One labelled progress bar: big percentage, bar, "x of y" line underneath. */
function ProgressBar({ label, pct, sub, fill }: { label: string; pct: number; sub: string; fill: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-lg text-bark-dark">{label}</span>
        <span className="font-display text-4xl text-bark-dark tabular-nums">{pct}%</span>
      </div>
      <div className="bar-track mt-1 h-4" role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full" style={{ width: `${pct}%`, background: fill, boxShadow: 'inset 0 -3px 0 rgb(0 0 0 / 0.25)' }} />
      </div>
      <div className="mt-1.5 text-sm text-paper-muted">{sub}</div>
    </div>
  )
}

function ProgressStrip() {
  const t = useDict(ui)
  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-4" aria-label="Development progress">
      <div className="paper grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <ProgressBar
          label={t.progress.design}
          pct={percent(stats.decisions.locked, stats.decisions.total)}
          sub={t.progress.designSub(stats.decisions.locked, stats.decisions.total)}
          fill="linear-gradient(180deg, #ffe071, #ffc94b 50%, #d9a032)"
        />
        <ProgressBar
          label={t.progress.build}
          pct={percent(stats.specs.done, stats.specs.total)}
          sub={t.progress.buildSub(stats.specs.done, stats.specs.total)}
          fill="linear-gradient(180deg, var(--color-leaf-light), var(--color-leaf) 50%, #6aa332)"
        />
        <div className="border-t-2 border-bark/30 pt-4 text-center sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-6">
          <div className="font-display text-4xl text-bark-dark tabular-nums">
            {stats.prototypes.done}/{stats.prototypes.total}
          </div>
          <div className="text-sm text-paper-muted">{t.progress.prototypes}</div>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-parch-dim">{t.progress.live(timeAgo(stats.updatedAt))}</p>
    </section>
  )
}

/** The lore chapters as picture cards, straight from src/site/lore. */
function LoreTeaser() {
  const t = useDict(ui)
  const { lang } = useLang()
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading kicker={t.lore.kicker} title={t.lore.title}>
        {t.lore.intro}
      </SectionHeading>
      <div className="grid gap-5 md:grid-cols-2">
        {chapters.map((c) => {
          const text = chapterText(c, lang)
          const cover = storyImage(c.cover)
          return (
            <Link key={c.slug} to={`/lore/${c.slug}`} className="paper group flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
              {cover && (
                <span className="block overflow-hidden">
                  <img src={cover} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
              )}
              <span className="flex flex-1 flex-col p-5">
                <span className="font-display text-xs tracking-widest text-bark uppercase">
                  ★ {c.n === 0 ? `${t.lore.chapter(0)} · ${t.lore.prologue}` : t.lore.chapter(c.n)}
                </span>
                <span className="mt-1 font-display text-2xl text-bark-dark">{text.title}</span>
                <span className="mt-2 text-sm text-paper-muted">{text.summary}</span>
                <span className="mt-auto pt-4 font-display text-sm text-[#2f5a17]">{t.lore.read} ▶</span>
              </span>
            </Link>
          )
        })}
      </div>
      <p className="mt-6 text-center">
        <Link to="/lore" className="font-display text-leaf hover:underline">
          {t.lore.all} ▶
        </Link>
      </p>
    </section>
  )
}

/** The first-city concept board, shown as the first draft of the city's design theme. */
function CityArt() {
  const t = useDict(ui).cityArt
  const board = storyImage('city-board')
  if (!board) return null
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading kicker={t.kicker} title={t.title}>
        {t.intro}
      </SectionHeading>
      <a href={board} target="_blank" rel="noreferrer" className="group block" aria-label={t.open}>
        <img
          src={board}
          alt={t.title}
          loading="lazy"
          className="w-full shadow-[0_0_0_3px_var(--color-bark),0_0_0_6px_var(--color-bark-dark),0_10px_30px_rgb(0_0_0_/_0.6)] transition group-hover:brightness-110"
        />
      </a>
      <p className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-display text-gold">✎ {t.draft}</span>
        <a href={board} target="_blank" rel="noreferrer" className="font-display text-leaf hover:underline">
          ⤢ {t.open}
        </a>
      </p>
    </section>
  )
}

export function Home() {
  const t = useDict(ui)
  const c = useDict(copy)
  const later = useDict(comingLater)
  const { lang } = useLang()
  return (
    <>
      <Hero />
      <ProgressStrip />

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <SectionHeading kicker={t.game.kicker} title={t.game.title}>
          {c.pitch}
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 6).map((f) => {
            const ft = f.text[lang]
            return (
              <Link key={f.slug} to={`/features#${f.slug}`} className="slate group flex gap-4 p-5 transition-transform hover:-translate-y-1">
                <div className="grid size-16 shrink-0 place-items-center bg-black/30 shadow-[inset_0_0_0_2px_var(--color-bark)]">
                  <PixelIcon name={f.icon} className="size-11 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="text-lg text-cream">{ft.title}</h3>
                  <p className="mt-1 text-sm text-parch-dim">{ft.short}</p>
                  {ft.tag && <span className="mt-2 inline-block font-display text-xs text-gold">★ {ft.tag}</span>}
                </div>
              </Link>
            )
          })}
        </div>
        <p className="mt-6 text-center">
          <Link to="/features" className="font-display text-leaf hover:underline">
            {t.game.all} ▶
          </Link>
        </p>
      </section>

      <LoreTeaser />
      <CityArt />

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <SectionHeading kicker={t.road.kicker} title={t.road.title}>
          {t.road.intro}
        </SectionHeading>
        <ol className="grid gap-5 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2 lg:grid-cols-3 lg:[&>li:last-child:nth-child(odd)]:col-span-1">
          {stageProgress.slice(0, 3).map((s, i) => (
            <StageCard key={String(s.key)} s={s} index={i} />
          ))}
        </ol>
        <p className="mt-6 text-center">
          <Link to="/roadmap" className="font-display text-leaf hover:underline">
            {t.road.full} ▶
          </Link>
        </p>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <SectionHeading kicker={t.devlog.kicker} title={t.devlog.latest} />
        <div className="grid gap-5 md:grid-cols-2">
          {posts.slice(0, 2).map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-4xl px-4">
        <div className="wood relative overflow-hidden px-6 py-10 text-center shadow-[0_0_0_3px_#2a1816]">
          <p className="font-display text-sm tracking-[0.3em] text-leaf uppercase">{t.later.kicker}</p>
          <h2 className="mt-1 text-3xl text-cream">{t.later.title}</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-3">
            {later.map((x) => (
              <li key={x} className="paper px-4 py-2 font-display text-bark-dark">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
