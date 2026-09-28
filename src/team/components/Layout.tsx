import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTeamSession } from '../../auth/session'
import { LangSwitch, useDict } from '../../shared/i18n'
import { timeAgo } from '../../shared/time'
import { meta } from '../lib/data'
import { strings } from '../strings'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Logo({ subtitle }: { subtitle: string }) {
  return (
    <Link to="/team" className="group flex items-center gap-2.5" aria-label={`${subtitle} home`}>
      <svg viewBox="0 0 16 16" className="size-10 drop-shadow-[0_2px_0_rgb(0_0_0_/_0.6)]" shapeRendering="crispEdges" aria-hidden>
        <rect width="16" height="16" fill="#2a1816" />
        <rect x="1" y="1" width="14" height="14" fill="#c9b68b" />
        <rect x="1" y="1" width="14" height="2" fill="#d8c595" />
        <path fill="#412624" d="M3 5h2v7H3zM7 5h2v7H7zM11 5h2v7h-2zM5 10h2v2H5zM9 10h2v2H9z" />
        <rect x="3" y="3" width="10" height="1" fill="#88cc42" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-xl text-gold drop-shadow-[0_2px_0_rgb(0_0_0_/_0.7)] group-hover:text-cream">WC-MMO</span>
        <span className="mt-0.5 block font-display text-xs tracking-[0.2em] text-leaf uppercase">{subtitle}</span>
      </span>
    </Link>
  )
}

export function Layout() {
  const t = useDict(strings)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { signOut } = useTeamSession()
  useEffect(() => setOpen(false), [pathname])

  const nav = [
    { to: '/team', label: t.nav.overview, end: true },
    { to: '/team/specs', label: t.nav.specs },
    { to: '/team/graph', label: t.nav.graph },
    { to: '/team/decisions', label: t.nav.decisions },
    { to: '/team/roadmap', label: t.nav.roadmap },
    { to: '/team/questions', label: t.nav.questions },
    { to: '/team/plugins', label: t.nav.plugins },
    { to: '/team/read', label: t.nav.library },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold focus:p-2 focus:text-night">
        {t.layout.skip}
      </a>
      <header className="wood sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Logo subtitle={t.layout.teamCodex} />
          <nav className="ml-auto hidden xl:block" aria-label="Main">
            <ul className="flex items-center gap-0.5">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      `block rounded-sm px-3 py-2 font-display text-[16px] transition-colors ${
                        isActive ? 'bg-black/30 text-gold shadow-[inset_0_-3px_0_var(--color-leaf)]' : 'text-cream hover:bg-black/15 hover:text-gold'
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <LangSwitch className="ml-auto xl:ml-2" />
          <div className="hidden items-center gap-2 xl:flex">
            <Link to="/" className="px-1 font-display text-lg text-cream hover:text-gold" title={t.layout.publicSite} aria-label={t.layout.publicSite}>
              ⌂
            </Link>
            <button className="btn" onClick={signOut}>
              {t.layout.signOut}
            </button>
          </div>
          <button className="btn xl:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
            {open ? '✖' : '☰'} {t.layout.menu}
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" className="border-t-2 border-black/30 xl:hidden" aria-label="Main">
            <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-4">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className={({ isActive }) => `block px-3 py-2.5 font-display text-lg ${isActive ? 'bg-black/25 text-gold' : 'text-cream'}`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link to="/" className="block px-3 py-2.5 font-display text-lg text-cream">
                  ⌂ {t.layout.publicSite}
                </Link>
              </li>
              <li>
                <button className="block w-full px-3 py-2.5 text-left font-display text-lg text-cream" onClick={signOut}>
                  ⏻ {t.layout.signOut}
                </button>
              </li>
            </ul>
          </nav>
        )}
        <div aria-hidden className="h-1 bg-[repeating-linear-gradient(90deg,#88cc42_0_12px,#6aa332_12px_24px)]" />
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="wood mt-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm text-paper-light">
          <span className="font-display">
            {t.layout.footer} ·{' '}
            <Link to="/" className="underline hover:text-cream">
              {t.layout.publicSite}
            </Link>
          </span>
          <span>
            {t.layout.syncedFrom} <code className="font-mono text-gold">wcmmo-specs@{meta.head || '—'}</code> ({meta.branch}) · {timeAgo(meta.syncedAt)}
          </span>
        </div>
      </footer>
    </div>
  )
}
