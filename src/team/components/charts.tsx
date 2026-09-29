import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts'
import { decisionAreas, decisions, meta, specs } from '../lib/data'
import { useDict } from '../../shared/i18n'
import { fmtShort } from '../../shared/time'
import { strings } from '../strings'

/** True on screens at least `px` wide; charts use it to shrink their label column on phones. */
function useWide(px = 640) {
  const query = `(min-width: ${px}px)`
  const [wide, setWide] = useState(() => typeof matchMedia === 'undefined' || matchMedia(query).matches)
  useEffect(() => {
    const m = matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return wide
}

const shorten = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)

const axis = { stroke: 'var(--color-slate-line)', tick: { fill: 'var(--color-parch-dim)', fontSize: 12 }, tickLine: false }

function Tip({ active, payload, label, unit }: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload?.length) return null
  const rows = payload.filter((p) => p.value)
  return (
    <div className="slate min-w-40 px-3 py-2 text-sm">
      <div className="mb-1 font-display text-cream">{label}</div>
      {rows.map((p) => (
        <div key={p.dataKey as string} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-parch-dim">
            <span className="inline-block size-2.5" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono text-parch-ink tabular-nums">
            {p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-parch-dim">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className="inline-block size-2.5" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  )
}

const DONE = 'var(--color-st-done)'
const PARTLY = 'var(--color-st-partly)'
const OPEN = 'var(--color-st-open)'

/** Decisions per GDD area, stacked by status. */
export function DecisionsByArea() {
  const t = useDict(strings).charts
  const wide = useWide()
  const data = decisionAreas
    .map((area) => {
      const ds = decisions.filter((d) => d.area === area)
      return {
        area,
        decided: ds.filter((d) => d.status === 'DECIDED').length,
        partly: ds.filter((d) => d.status === 'PARTLY' || d.status === 'TESTING').length,
        open: ds.filter((d) => d.status === 'OPEN').length,
      }
    })
    .sort((a, b) => b.open - a.open)
  return (
    <div>
      <Legend items={[{ label: t.decided, color: DONE }, { label: t.partly, color: PARTLY }, { label: t.open, color: OPEN }]} />
      <div className="mt-3" style={{ height: data.length * 34 + 30 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }} barCategoryGap={8}>
            <CartesianGrid horizontal={false} stroke="var(--color-slate-line)" strokeDasharray="2 4" />
            <XAxis type="number" allowDecimals={false} {...axis} />
            <YAxis type="category" dataKey="area" width={wide ? 150 : 104} {...axis} tick={{ ...axis.tick, fontSize: wide ? 12 : 11 }} />
            <Tooltip content={<Tip />} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
            <Bar isAnimationActive={false} dataKey="decided" name={t.decided} stackId="a" fill={DONE} stroke="var(--color-slate)" strokeWidth={2} />
            <Bar isAnimationActive={false} dataKey="partly" name={t.partly} stackId="a" fill={PARTLY} stroke="var(--color-slate)" strokeWidth={2} />
            <Bar isAnimationActive={false} dataKey="open" name={t.open} stackId="a" fill={OPEN} stroke="var(--color-slate)" strokeWidth={2} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/** Unresolved decisions each unfinished spec cites: the list of what stands between it and READY. */
export function SpecBlockers() {
  const t = useDict(strings).charts
  const wide = useWide()
  const navigate = useNavigate()
  const data = specs
    .filter((s) => s.status !== 'DONE' && s.status !== 'SUPERSEDED')
    .map((s) => ({ id: s.id, name: `${s.id} ${shorten(s.title.split(/[:(]/)[0].trim(), wide ? 30 : 16)}`, Blockers: s.blockers.length }))
    .sort((a, b) => b.Blockers - a.Blockers || a.id.localeCompare(b.id))
  return (
    <div style={{ height: data.length * 24 + 30 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap={5}>
          <CartesianGrid horizontal={false} stroke="var(--color-slate-line)" strokeDasharray="2 4" />
          <XAxis type="number" allowDecimals={false} {...axis} />
          <YAxis type="category" dataKey="name" width={wide ? 200 : 128} {...axis} tick={{ ...axis.tick, fontSize: 11 }} />
          <Tooltip content={<Tip unit={t.openDecisions} />} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
          <Bar
            isAnimationActive={false}
            dataKey="Blockers"
            name={t.blocking}
            fill={OPEN}
            radius={[0, 3, 3, 0]}
            className="cursor-pointer"
            onClick={(d: { id?: string }) => d.id && navigate(`/team/specs/${d.id}`)}
            label={{ position: 'right', fill: 'var(--color-parch-dim)', fontSize: 11 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Lines written in the specs repo per day, from git history. */
export function SpecActivity() {
  const t = useDict(strings).charts
  const byDay = new Map<string, { day: string; Added: number; Removed: number; commits: number }>()
  for (const c of [...meta.commits].reverse()) {
    const day = c.date.slice(0, 10)
    const row = byDay.get(day) ?? { day, Added: 0, Removed: 0, commits: 0 }
    row.Added += c.insertions
    row.Removed += c.deletions
    row.commits++
    byDay.set(day, row)
  }
  const data = [...byDay.values()].map((r) => ({ ...r, label: fmtShort(r.day) }))
  return (
    <div>
      <Legend items={[{ label: t.added, color: DONE }, { label: t.removed, color: OPEN }]} />
      <div className="mt-3 h-52">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: -12, right: 8, top: 4, bottom: 0 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--color-slate-line)" strokeDasharray="2 4" />
            <XAxis dataKey="label" {...axis} />
            <YAxis allowDecimals={false} {...axis} />
            <Tooltip content={<Tip />} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
            <Bar isAnimationActive={false} dataKey="Added" name={t.added} fill={DONE} radius={[3, 3, 0, 0]} maxBarSize={36} />
            <Bar isAnimationActive={false} dataKey="Removed" name={t.removed} fill={OPEN} radius={[3, 3, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
