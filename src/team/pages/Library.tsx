import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { PageHeader } from '../components/ui'
import { boards, docs, files, meta, specs } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { timeAgo } from '../../shared/time'
import { strings } from '../strings'
import { NotFound } from './NotFound'

const GITHUB = 'https://github.com/wishcode-project/wcmmo-specs/blob/main/'

export function Library() {
  const t = useDict(strings)
  const l = t.library
  const groups = ['Design', 'Brief', 'Registry', 'ADR'] as const
  return (
    <>
      <PageHeader kicker={l.kicker} title={l.title}>
        {l.intro}
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g}>
            <h2 className="mb-3 text-xl text-gold">{l.groups[g]}</h2>
            <ul className="flex flex-col gap-3">
              {docs
                .filter((d) => d.group === g)
                .map((d) => (
                  <li key={d.path}>
                    <Link to={`/team/read/${d.path.replace(/\.md$/, '')}`} className="paper block p-4 transition-transform hover:-translate-y-0.5">
                      <span className="font-display text-lg text-bark-dark">{d.title}</span>
                      <span className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-paper-muted">
                        <code className="font-mono">{d.path}</code>
                        <span>
                          {d.note && <strong className="mr-2 text-st-fail">{d.note}</strong>}
                          {meta.fileDates[d.path] ? `${t.common.updated} ${timeAgo(meta.fileDates[d.path])}` : ''}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
        <section>
          <h2 className="mb-3 text-xl text-gold">{t.nav.specs}</h2>
          <p className="text-sm text-parch-dim">
            {l.specsLive(specs.length)}{' '}
            <Link to="/team/specs" className="text-leaf underline">
              {t.nav.specs}
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}

export function ReadDoc() {
  const t = useDict(strings)
  const path = `${useParams()['*'] ?? ''}.md`
  const source = files[path]
  if (!source) return <NotFound />
  const doc = docs.find((d) => d.path === path)
  return (
    <>
      <nav className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-parch-dim" aria-label="Breadcrumb">
        <span>
          <Link to="/team/read" className="hover:text-leaf">
            {t.nav.library}
          </Link>
          <span aria-hidden> › </span>
          <code className="font-mono text-parch-ink">{path}</code>
        </span>
        <a className="btn text-xs" href={GITHUB + path} target="_blank" rel="noreferrer">
          {t.common.openOnGithub}
        </a>
      </nav>
      {doc?.note && <p className="mb-4 border-l-4 border-st-fail bg-st-fail/15 px-4 py-2 text-sm text-cream">{t.library.note(doc.note)}</p>}
      {t.englishSource && <p className="mb-4 text-sm text-parch-dim">{t.englishSource}</p>}
      {path === 'gdd/lore-bible.md' && Object.keys(boards).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xl text-gold">{t.library.boards}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(boards).map(([p, url]) => (
              <a key={p} href={url} target="_blank" rel="noreferrer" className="slate block overflow-hidden hover:brightness-110">
                <img src={url} alt={p} loading="lazy" className="aspect-video w-full object-cover" />
                <span className="block px-3 py-2 font-mono text-xs text-parch-dim">{p.replace('gdd/boards/', '')}</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <article className="paper p-5 sm:p-10" lang="en">
        <Markdown source={source} basePath={path} />
      </article>
    </>
  )
}
