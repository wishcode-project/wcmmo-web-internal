import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useDict } from '../../shared/i18n'
import { SectionHeading } from '../parts'
import { guideUi } from './ui'

/** Guide pages share a heading and a tab strip (Bloodlines · Weapons & skills · Runes · Stats). */
export function GuideLayout() {
  const t = useDict(guideUi)
  const tabs = [
    { to: '/guide/bloodlines', label: t.tabs.bloodlines },
    { to: '/guide/skills', label: t.tabs.skills },
    { to: '/guide/runes', label: t.tabs.runes },
    { to: '/guide/stats', label: t.tabs.stats },
  ]
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:pt-16">
      <SectionHeading kicker={t.kicker} title={t.title}>
        {t.intro}
      </SectionHeading>
      <nav aria-label={t.kicker} className="mb-6 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `btn px-4 py-2 text-sm ${isActive ? 'btn-leaf' : ''}`}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
      <p className="mt-8 text-center text-xs text-parch-dim">✎ {t.draft}</p>
    </div>
  )
}

/** Minecraft-style item tooltip: dark panel with a purple gradient border. */
export function Tooltip({ title, color = '#fff7cf', children, className = '' }: { title: ReactNode; color?: string; children?: ReactNode; className?: string }) {
  return (
    <div
      className={`relative p-[3px] ${className}`}
      style={{ background: 'linear-gradient(180deg, #5000ff, #28007f)', boxShadow: '0 0 0 2px #140414, 0 6px 0 rgb(0 0 0 / 0.35)' }}
    >
      <div className="h-full bg-[#120812] px-4 py-3 text-sm text-[#d7d0dc]">
        <div className="font-display text-base" style={{ color, textShadow: '1px 1px 0 rgb(0 0 0 / 0.6)' }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  )
}

/** A 5-segment rating bar, like the class pages on wynncraft.com. */
export function Rating({ label, value, color = 'var(--color-leaf)' }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="text-sm text-paper-text">{label}</div>
      <div className="mt-1 grid grid-cols-5 gap-1" role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={5}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="h-2.5" style={{ background: n <= value ? color : 'rgb(65 38 36 / 0.3)', boxShadow: 'inset 0 -2px 0 rgb(0 0 0 / 0.2)' }} />
        ))}
      </div>
    </div>
  )
}

/** Dark stone panel, like the ability tree frame. */
export function Stone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative p-5 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #34363d, #26282d)',
        boxShadow: 'inset 0 0 0 3px #4a4d55, inset 0 0 0 5px #1b1c20, 0 6px 0 rgb(0 0 0 / 0.4)',
      }}
    >
      {children}
    </div>
  )
}

export const GuideTitle = ({ children }: { children: ReactNode }) => <h2 className="mb-3 text-xl text-bark-dark">{children}</h2>
