// Public data: devlog posts (src/site/devlog/*.md), lore chapters (src/site/lore/*.md) and the progress numbers from
// content/public-stats.json. Never import src/team or content/*.md from here.
import statsJson from '../../content/public-stats.json'
import type { Lang } from '../shared/i18n'
import { stages, type Stage } from './config'

export const stats = statsJson as {
  updatedAt: string
  specs: { done: number; total: number }
  foundation: { done: number; total: number }
  phases: { n: number; specsDone: number; specsTotal: number }[]
  prototypes: { done: number; total: number }
  decisions: { locked: number; total: number }
}

interface PostText {
  title: string
  tag: string
  summary: string
  body: string
}

export interface Post {
  slug: string
  date: string
  en: PostText
  /** Thai version from `<slug>.th.md`, if written */
  th?: PostText
}

/** The post in the requested language, falling back to English. */
export const postText = (p: Post, lang: Lang) => (lang === 'th' && p.th ? p.th : p.en)

const raw = import.meta.glob('./devlog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parse(md: string) {
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(md)
  const fields = Object.fromEntries(
    (fm?.[1] ?? '').split('\n').map((l) => {
      const i = l.indexOf(':')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
  )
  return {
    date: fields.date ?? '',
    text: { title: fields.title ?? 'Untitled', tag: fields.tag ?? 'News', summary: fields.summary ?? '', body: fm ? md.slice(fm[0].length) : md },
  }
}

export const posts: Post[] = (() => {
  const bySlug = new Map<string, Post>()
  const entries = Object.entries(raw).map(([path, md]) => {
    const file = path.replace(/^.*\//, '').replace(/\.md$/, '')
    const th = file.endsWith('.th')
    return { slug: th ? file.slice(0, -3) : file, th, ...parse(md) }
  })
  for (const e of entries.filter((x) => !x.th)) bySlug.set(e.slug, { slug: e.slug, date: e.date, en: e.text })
  for (const e of entries.filter((x) => x.th)) {
    const post = bySlug.get(e.slug)
    if (post) post.th = e.text
  }
  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date))
})()

interface ChapterText {
  title: string
  summary: string
  body: string
}

export interface Chapter {
  slug: string
  /** Chapter number from the front matter (0 = prologue) */
  n: number
  en: ChapterText
  /** Thai version from `<slug>.th.md`, if written */
  th?: ChapterText
}

/** The chapter in the requested language, falling back to English. */
export const chapterText = (c: Chapter, lang: Lang) => (lang === 'th' && c.th ? c.th : c.en)

const loreRaw = import.meta.glob('./lore/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/** Public, spoiler-free lore chapters (src/site/lore/NN-slug.md + .th.md), in chapter order. */
export const chapters: Chapter[] = (() => {
  const bySlug = new Map<string, Chapter>()
  const entries = Object.entries(loreRaw).map(([path, md]) => {
    const file = path.replace(/^.*\//, '').replace(/\.md$/, '')
    const th = file.endsWith('.th')
    const fm = /^---\n([\s\S]*?)\n---\n?/.exec(md)
    const fields = Object.fromEntries(
      (fm?.[1] ?? '').split('\n').map((l) => {
        const i = l.indexOf(':')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      }),
    )
    const text: ChapterText = { title: fields.title ?? 'Untitled', summary: fields.summary ?? '', body: fm ? md.slice(fm[0].length) : md }
    return { slug: th ? file.slice(0, -3) : file, th, n: Number(fields.chapter ?? 0), text }
  })
  for (const e of entries.filter((x) => !x.th)) bySlug.set(e.slug, { slug: e.slug, n: e.n, en: e.text })
  for (const e of entries.filter((x) => x.th)) {
    const chapter = bySlug.get(e.slug)
    if (chapter) chapter.th = e.text
  }
  return [...bySlug.values()].sort((a, b) => a.n - b.n)
})()

export interface StageProgress extends Stage {
  done: number
  total: number
  unit: 'systems' | 'prototypes'
  state: 'complete' | 'current' | 'planned'
}

/** Stages with progress; the first unfinished one is "current". */
export const stageProgress: StageProgress[] = (() => {
  let currentFound = false
  return stages.map((s) => {
    let done = 0
    let total = 0
    let unit: StageProgress['unit'] = 'systems'
    if (s.key === 'foundation') {
      ;({ done, total } = stats.foundation)
    } else if (s.key === 0) {
      ;({ done, total } = stats.prototypes)
      unit = 'prototypes'
    } else {
      const p = stats.phases.find((x) => x.n === s.key)
      done = p?.specsDone ?? 0
      total = p?.specsTotal ?? 0
    }
    const complete = total > 0 && done >= total
    const state: StageProgress['state'] = complete ? 'complete' : currentFound ? 'planned' : 'current'
    if (!complete) currentFound = true
    return { ...s, done, total, unit, state }
  })
})()
