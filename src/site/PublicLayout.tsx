import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LangSwitch, useDict } from '../shared/i18n'
import { copy, site, ui } from './config'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Wordmark({ size = 'md' }: { size?: 'md' | 'xl' }) {
  const big = size === 'xl'
  return (
    <span className={`inline-flex items-center ${big ? 'gap-4' : 'gap-2.5'}`}>
      <svg viewBox="0 0 16 16" className={`${big ? 'size-20 sm:size-24' : 'size-10'} drop-shadow-[0_3px_0_rgb(0_0_0_/_0.6)]`} shapeRendering="crispEdges" aria-hidden>
        <rect width="16" height="16" fill="#2a1816" />
        <rect x="1" y="1" width="14" height="14" fill="#c9b68b" />
        <rect x="1" y="1" width="14" height="2" fill="#d8c595" />
        <path fill="#412624" d="M3 5h2v7H3zM7 5h2v7H7zM11 5h2v7h-2zM5 10h2v2H5zM9 10h2v2H9z" />
        <rect x="3" y="3" width="10" height="1" fill="#88cc42" />
      </svg>
      <span className={`font-display leading-none tracking-tight text-gold drop-shadow-[0_3px_0_rgb(0_0_0_/_0.75)] ${big ? 'text-6xl sm:text-8xl' : 'text-2xl'}`}>{site.name}</span>
    </span>
  )
}

export function PublicLayout() {
  const t = useDict(ui)
  const c = useDict(copy)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  const nav = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/features', label: t.nav.features },
    { to: '/roadmap', label: t.nav.roadmap },
    { to: '/lore', label: t.nav.lore },
    { to: '/devlog', label: t.nav.devlog },
  ]

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold focus:p-2 focus:text-night">
        {t.skip}
      </a>
      <header className="wood sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" aria-label={`${site.name} home`}>
            <Wordmark />
          </Link>
          <nav className="ml-auto hidden md:block" aria-label="Main">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      `block rounded-sm px-3.5 py-2 font-display text-[17px] transition-colors ${
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
          <LangSwitch className="ml-auto md:ml-2" />
          <Link to="/team" className="btn hidden md:inline-flex" title="Dev team only">
            🔒 {t.nav.team}
          </Link>
          <button className="btn md:hidden" aria-expanded={open} aria-controls="public-mobile-nav" onClick={() => setOpen((o) => !o)}>
            {open ? '✖' : '☰'} {t.menu}
          </button>
        </div>
        {open && (
          <nav id="public-mobile-nav" className="border-t-2 border-black/30 md:hidden" aria-label="Main">
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className={({ isActive }) => `block px-3 py-2.5 font-display text-lg ${isActive ? 'bg-black/25 text-gold' : 'text-cream'}`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link to="/team" className="block px-3 py-2.5 font-display text-lg text-cream">
                  🔒 {t.nav.team}
                </Link>
              </li>
            </ul>
          </nav>
        )}
        <div aria-hidden className="h-1 bg-[repeating-linear-gradient(90deg,#88cc42_0_12px,#6aa332_12px_24px)]" />
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="wood mt-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-paper-light sm:grid-cols-3">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-xs text-paper-light/80">{c.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <p className="font-display text-gold">{t.explore}</p>
            <ul className="mt-2 space-y-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-cream hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-gold">{t.community}</p>
            <p className="mt-2 text-paper-light/80">
              {site.discordUrl ? (
                <a href={site.discordUrl} className="underline hover:text-cream">
                  {t.joinDiscord}
                </a>
              ) : (
                t.discordSoon
              )}
            </p>
            <p className="mt-4 text-xs text-paper-light/60">
              {t.notAffiliated} ·{' '}
              <Link to="/team" className="underline hover:text-cream">
                {t.nav.team}
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
