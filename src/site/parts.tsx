import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDict, useLang } from '../shared/i18n'
import { fmtDate } from '../shared/time'
import { copy, site, ui } from './config'
import { postText, type Post, type StageProgress } from './content'

export function SectionHeading({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-display text-sm tracking-[0.3em] text-leaf uppercase">{kicker}</p>
      <h2 className="mt-1 text-3xl text-cream drop-shadow-[0_3px_0_rgb(0_0_0_/_0.6)] sm:text-4xl">{title}</h2>
      {children && <p className="mx-auto mt-3 max-w-2xl text-parch-dim">{children}</p>}
    </div>
  )
}

/** Server address with a copy button, or an "opening soon" plate. */
export function ServerPlate() {
  const t = useDict(ui)
  const c = useDict(copy)
  const [copied, setCopied] = useState(false)
  if (!site.serverIp)
    return (
      <div className="paper inline-flex flex-col items-center px-8 py-3">
        <span className="font-display text-xs tracking-widest text-bark uppercase">{t.serverStatus}</span>
        <span className="font-display text-2xl text-bark-dark">{t.openingSoon}</span>
      </div>
    )
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.serverIp!)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the address is still visible to copy by hand */
    }
  }
  return (
    <button onClick={doCopy} className="paper inline-flex flex-col items-center px-8 py-3 transition-transform hover:-translate-y-0.5" aria-label={`${t.clickToCopy}: ${site.serverIp}`}>
      <span className="font-display text-xs tracking-widest text-bark uppercase">{copied ? t.copied : `${t.clickToCopy} · ${c.edition}`}</span>
      <span className="font-display text-2xl text-bark-dark">{site.serverIp}</span>
    </button>
  )
}

const stateColor = {
  complete: 'var(--color-st-done)',
  current: 'var(--color-gold)',
  planned: 'var(--color-st-none)',
}

export function StageCard({ s, index }: { s: StageProgress; index: number }) {
  const t = useDict(ui)
  const { lang } = useLang()
  const text = s.text[lang]
  const pct = s.total ? Math.round((s.done / s.total) * 100) : 0
  return (
    <li className={`paper relative flex flex-col p-5 ${s.state === 'planned' ? 'opacity-80' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm tracking-widest text-bark uppercase">{t.stage(index)}</span>
        <span className="chip font-display" style={{ color: '#fff', background: stateColor[s.state], borderColor: 'rgb(0 0 0 / 0.3)', textShadow: '0 1px 0 rgb(0 0 0 / 0.5)' }}>
          {s.state === 'complete' ? '✔ ' : s.state === 'current' ? '⚒ ' : '… '}
          {t.state[s.state]}
        </span>
      </div>
      <h3 className="mt-1 text-xl text-bark-dark">{text.title}</h3>
      <p className="mt-1 text-sm text-paper-muted">{text.blurb}</p>
      <div className="mt-auto pt-4">
        {s.total > 0 ? (
          <>
            <div className="bar-track h-3">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 flex justify-between text-xs text-paper-muted">
              <span>
                {s.done} / {s.total} {t.units[s.unit]}
              </span>
              <span className="font-mono">{pct}%</span>
            </p>
          </>
        ) : (
          <p className="text-xs text-paper-muted italic">{t.designLater}</p>
        )}
      </div>
    </li>
  )
}

export function PostCard({ p }: { p: Post }) {
  const t = useDict(ui)
  const { lang } = useLang()
  const text = postText(p, lang)
  return (
    <Link to={`/devlog/${p.slug}`} className="paper group flex flex-col p-5 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between text-xs text-paper-muted">
        <span className="chip border-bark/60 font-display text-bark">{text.tag}</span>
        <time dateTime={p.date}>{fmtDate(p.date)}</time>
      </div>
      <h3 className="mt-3 text-xl leading-snug text-bark-dark group-hover:text-[#2f5a17]">{text.title}</h3>
      <p className="mt-2 text-sm text-paper-muted">{text.summary}</p>
      <span className="mt-auto pt-4 font-display text-sm text-[#2f5a17]">{t.devlog.readMore} ▶</span>
    </Link>
  )
}
