import { Link } from 'react-router-dom'
import { HeroArt } from '../shared/HeroArt'
import { useDict, useLang } from '../shared/i18n'
import { timeAgo } from '../shared/time'
import { comingLater, copy, features, site, ui } from './config'
import { posts, stageProgress, stats } from './content'
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

function ProgressStrip() {
  const t = useDict(ui)
  const pct = Math.round((stats.specs.done / Math.max(stats.specs.total, 1)) * 100)
  const items = [
    { value: `${pct}%`, label: t.progress.built },
    { value: `${stats.prototypes.done}/${stats.prototypes.total}`, label: t.progress.prototypes },
    { value: String(stats.decisions.locked), label: t.progress.decisions },
  ]
  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-4" aria-label="Development progress">
      <div className="paper grid gap-2 p-5 sm:grid-cols-3 sm:p-6">
        {items.map((i) => (
          <div key={i.label} className="text-center">
            <div className="font-display text-4xl text-bark-dark">{i.value}</div>
            <div className="text-sm text-paper-muted">{i.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-parch-dim">{t.progress.live(timeAgo(stats.updatedAt))}</p>
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

      <section className="mx-auto mt-24 max-w-6xl px-4">
        <SectionHeading kicker={t.road.kicker} title={t.road.title}>
          {t.road.intro}
        </SectionHeading>
        <ol className="grid gap-5 md:grid-cols-3">
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
