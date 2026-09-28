import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inline, PageHeader, SpecChip } from '../components/ui'
import { useDict } from '../../shared/i18n'
import { plugins, type Plugin } from '../lib/data'
import { strings } from '../strings'

const statusStyle: Record<Plugin['statusKey'], { color: string; label: string }> = {
  installed: { color: 'var(--color-st-done)', label: 'installed' },
  owned: { color: 'var(--color-st-partly)', label: 'owned' },
  free: { color: 'var(--color-st-partly)', label: 'free' },
  'to buy': { color: 'var(--color-st-fail)', label: 'to buy' },
  undecided: { color: 'var(--color-st-open)', label: 'undecided' },
  'to write': { color: 'var(--color-st-ready)', label: 'to write' },
  parked: { color: 'var(--color-st-none)', label: 'parked' },
  other: { color: 'var(--color-st-none)', label: 'other' },
}

const order: Plugin['statusKey'][] = ['installed', 'owned', 'free', 'to write', 'undecided', 'to buy', 'parked', 'other']

export function Plugins() {
  const t = useDict(strings)
  const p = t.plugins
  const [filter, setFilter] = useState<Plugin['statusKey'] | ''>('')
  const list = useMemo(() => plugins.filter((p) => !filter || p.statusKey === filter), [filter])
  const tally = order.map((k) => ({ k, n: plugins.filter((p) => p.statusKey === k).length })).filter((t) => t.n)

  return (
    <>
      <PageHeader kicker="docs/plugins.md" title={p.title}>
        {p.intro1}{' '}
        <Link to="/team/read/docs/plugins" className="text-leaf underline">
          {p.guide}
        </Link>
        .
      </PageHeader>

      {/* status composition: one stacked strip, each segment labelled in the buttons below */}
      <div className="slate mb-3 flex h-4 overflow-hidden p-0" aria-hidden>
        {tally.map((t) => (
          <div key={t.k} style={{ width: `${(t.n / plugins.length) * 100}%`, background: statusStyle[t.k].color }} className="border-r-2 border-slate last:border-0" />
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={p.headers[2]}>
        <button className="btn text-xs" aria-pressed={!filter} onClick={() => setFilter('')}>
          {t.common.all} {plugins.length}
        </button>
        {tally.map((t) => (
          <button key={t.k} className="btn text-xs" aria-pressed={filter === t.k} onClick={() => setFilter(filter === t.k ? '' : t.k)}>
            <span className="inline-block size-2.5" style={{ background: statusStyle[t.k].color }} />
            {statusStyle[t.k].label} {t.n}
          </button>
        ))}
      </div>

      <div className="paper overflow-x-auto p-2">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr>
              {p.headers.map((h) => (
                <th key={h} className="bg-bark px-3 py-2 text-left font-display font-normal text-cream">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((pl) => (
              <tr key={pl.name} className="border-b border-bark/25 even:bg-paper-light/50 hover:bg-paper-lighter/60">
                <td className="px-3 py-2 font-bold text-bark-dark">{pl.name}</td>
                <td className="px-3 py-2 text-paper-muted">{pl.category}</td>
                <td className="px-3 py-2">
                  <span className="chip" style={{ borderColor: statusStyle[pl.statusKey].color, boxShadow: `inset 3px 0 0 ${statusStyle[pl.statusKey].color}` }}>
                    {pl.status}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono">{pl.version}</td>
                <td className="px-3 py-2">
                  <Inline text={pl.support} />
                </td>
                <td className="px-3 py-2">
                  <Inline text={pl.usedFor} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {pl.specs.map((s) => (
                      <SpecChip key={s} id={s} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-parch-dim">{p.legend}</p>
    </>
  )
}
