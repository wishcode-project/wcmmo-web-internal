import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useParams } from 'react-router-dom'
import { useDict, useLang } from '../shared/i18n'
import { fmtDate } from '../shared/time'
import { comingLater, features, ui } from './config'
import { chapterText, chapters, postText, posts, stageProgress, stats } from './content'
import { PixelIcon } from './PixelIcon'
import { PostCard, SectionHeading, StageCard } from './parts'

const Page = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-6xl px-4 pt-12 sm:pt-16">{children}</div>

export function Features() {
  const t = useDict(ui)
  const later = useDict(comingLater)
  const { lang } = useLang()
  return (
    <Page>
      <SectionHeading kicker={t.featuresPage.kicker} title={t.featuresPage.title}>
        {t.featuresPage.intro}
      </SectionHeading>
      <div className="flex flex-col gap-6">
        {features.map((f, i) => {
          const ft = f.text[lang]
          return (
            <article key={f.slug} id={f.slug} className={`paper flex scroll-mt-24 flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8 ${i % 2 ? 'sm:flex-row-reverse' : ''}`}>
              <div className="grid size-28 shrink-0 place-items-center self-center bg-bark-dark/85 shadow-[inset_0_0_0_3px_var(--color-bark),0_4px_0_rgb(0_0_0_/_0.3)]">
                <PixelIcon name={f.icon} className="size-20" />
              </div>
              <div className="flex-1">
                {ft.tag && <span className="font-display text-xs tracking-widest text-bark uppercase">★ {ft.tag}</span>}
                <h2 className="text-2xl text-bark-dark">{ft.title}</h2>
                <p className="mt-1 font-medium text-paper-muted">{ft.short}</p>
                <p className="mt-3 leading-relaxed">{ft.body}</p>
              </div>
            </article>
          )
        })}
      </div>
      <p className="mt-10 text-center text-parch-dim">{t.featuresPage.horizon(later.join(' · '))}</p>
    </Page>
  )
}

export function PublicRoadmap() {
  const t = useDict(ui)
  return (
    <Page>
      <SectionHeading kicker={t.road.kicker} title={t.road.fullTitle}>
        {t.road.fullIntro}
      </SectionHeading>
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stageProgress.map((s, i) => (
          <StageCard key={String(s.key)} s={s} index={i} />
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-parch-dim">{t.road.footer(fmtDate(stats.updatedAt))}</p>
    </Page>
  )
}

export function Devlog() {
  const t = useDict(ui)
  return (
    <Page>
      <SectionHeading kicker={t.devlog.kicker} title={t.devlog.title}>
        {t.devlog.intro}
      </SectionHeading>
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((p) => (
          <PostCard key={p.slug} p={p} />
        ))}
      </div>
    </Page>
  )
}

export function DevlogPost() {
  const t = useDict(ui)
  const { lang } = useLang()
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <PublicNotFound />
  const text = postText(post, lang)
  const idx = posts.indexOf(post)
  const newer = posts[idx - 1]
  const older = posts[idx + 1]
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:pt-16">
      <Link to="/devlog" className="text-sm text-parch-dim hover:text-leaf">
        ◀ {t.devlog.all}
      </Link>
      {lang === 'th' && !post.th && <p className="mt-3 border-l-4 border-gold bg-gold/10 px-3 py-2 text-sm text-cream">{t.devlog.englishOnly}</p>}
      <article className="paper mt-4 p-6 sm:p-10" lang={lang === 'th' && post.th ? 'th' : 'en'}>
        <div className="flex items-center justify-between text-xs text-paper-muted">
          <span className="chip border-bark/60 font-display text-bark">{text.tag}</span>
          <time dateTime={post.date}>{fmtDate(post.date)}</time>
        </div>
        <h1 className="mt-3 text-3xl text-bark-dark sm:text-4xl">{text.title}</h1>
        <div className="pixel-divider my-5 opacity-60" />
        <div className="prose-paper">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href = '', children }) =>
                href.startsWith('/') ? (
                  <Link to={href}>{children}</Link>
                ) : (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
            }}
          >
            {text.body}
          </ReactMarkdown>
        </div>
      </article>
      <nav className="mt-6 flex justify-between gap-4" aria-label={t.devlog.more}>
        {older ? (
          <Link to={`/devlog/${older.slug}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">◀ {postText(older, lang).title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link to={`/devlog/${newer.slug}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">{postText(newer, lang).title} ▶</span>
          </Link>
        )}
      </nav>
    </div>
  )
}

const chapterLabel = (n: number, t: { lore: { chapter: (n: number) => string; prologue: string } }) =>
  n === 0 ? `${t.lore.chapter(0)} · ${t.lore.prologue}` : t.lore.chapter(n)

const mdLinks = {
  a: ({ href = '', children }: { href?: string; children?: React.ReactNode }) =>
    href.startsWith('/') ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
}

export function Lore() {
  const t = useDict(ui)
  const { lang } = useLang()
  return (
    <Page>
      <SectionHeading kicker={t.lore.kicker} title={t.lore.title}>
        {t.lore.intro}
      </SectionHeading>
      <ol className="mx-auto flex max-w-3xl flex-col gap-5">
        {chapters.map((c) => {
          const text = chapterText(c, lang)
          return (
            <li key={c.slug}>
              <Link to={`/lore/${c.slug}`} className="paper block p-6 transition hover:-translate-y-0.5 sm:p-8">
                <span className="font-display text-xs tracking-widest text-bark uppercase">★ {chapterLabel(c.n, t)}</span>
                <h2 className="mt-1 text-2xl text-bark-dark sm:text-3xl">{text.title}</h2>
                <p className="mt-2 text-paper-muted">{text.summary}</p>
                <span className="mt-4 inline-block font-display text-leaf">{t.lore.read} ▶</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </Page>
  )
}

export function LoreChapter() {
  const t = useDict(ui)
  const { lang } = useLang()
  const { slug } = useParams()
  const chapter = chapters.find((c) => c.slug === slug)
  if (!chapter) return <PublicNotFound />
  const text = chapterText(chapter, lang)
  const idx = chapters.indexOf(chapter)
  const prev = chapters[idx - 1]
  const next = chapters[idx + 1]
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:pt-16">
      <Link to="/lore" className="text-sm text-parch-dim hover:text-leaf">
        ◀ {t.lore.all}
      </Link>
      {lang === 'th' && !chapter.th && <p className="mt-3 border-l-4 border-gold bg-gold/10 px-3 py-2 text-sm text-cream">{t.lore.englishOnly}</p>}
      <article className="paper mt-4 p-6 sm:p-10" lang={lang === 'th' && chapter.th ? 'th' : 'en'}>
        <span className="chip border-bark/60 font-display text-bark">{chapterLabel(chapter.n, t)}</span>
        <h1 className="mt-3 text-3xl text-bark-dark sm:text-4xl">{text.title}</h1>
        <div className="pixel-divider my-5 opacity-60" />
        <div className="prose-paper">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdLinks}>
            {text.body}
          </ReactMarkdown>
        </div>
      </article>
      <nav className="mt-6 flex justify-between gap-4" aria-label={t.lore.more}>
        {prev ? (
          <Link to={`/lore/${prev.slug}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">◀ {chapterText(prev, lang).title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/lore/${next.slug}`} className="btn max-w-[48%]">
            <span className="min-w-0 truncate">{chapterText(next, lang).title} ▶</span>
          </Link>
        )}
      </nav>
    </div>
  )
}

export function PublicNotFound() {
  const t = useDict(ui)
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-7xl text-gold drop-shadow-[0_4px_0_#000]">404</p>
      <h1 className="mt-3 text-2xl text-cream">{t.notFound.title}</h1>
      <p className="mt-2 text-parch-dim">{t.notFound.body}</p>
      <Link to="/" className="btn btn-leaf mt-6">
        ◀ {t.notFound.back}
      </Link>
    </div>
  )
}
