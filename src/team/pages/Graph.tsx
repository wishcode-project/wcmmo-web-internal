import { Background, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Legend } from '../components/charts'
import { DecisionBadge, Inline, PageHeader, PocBadge, SpecBadge, decisionStatusColor, pocColor, specStatusColor } from '../components/ui'
import { useDict } from '../../shared/i18n'
import { decisionById, decisions, phaseLabel, phases, pocs, specs } from '../lib/data'
import { strings } from '../strings'

type Kind = 'phase' | 'spec' | 'decision' | 'poc'

interface CardData extends Record<string, unknown> {
  kind: Kind
  title: string
  code: string
  color: string
  dim: boolean
  focus: boolean
}

const WIDTH: Record<Kind, number> = { phase: 190, spec: 250, decision: 230, poc: 170 }
const COL_X: Record<Kind, number> = { phase: 0, spec: 290, decision: 640, poc: 960 }

function Card({ data }: NodeProps<Node<CardData>>) {
  return (
    <div
      className="slate px-2.5 py-1.5 text-left transition-opacity"
      style={{
        width: WIDTH[data.kind],
        opacity: data.dim ? 0.22 : 1,
        boxShadow: `inset 4px 0 0 ${data.color}, 0 0 0 ${data.focus ? 2 : 0}px var(--color-gold)`,
      }}
    >
      <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-bark" />
      <div className="flex items-baseline gap-2">
        <span className="shrink-0 font-display text-sm" style={{ color: data.color }}>
          {data.code}
        </span>
        <span className="truncate text-xs text-parch-ink">{data.title}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-bark" />
    </div>
  )
}

const nodeTypes = { card: Card }

/** SVG fill attributes can't read CSS variables, so resolve `var(--x)` for the minimap. */
const cssColor = (c: string) => {
  const m = /^var\((--[\w-]+)\)$/.exec(c)
  return m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || '#888' : c
}

interface Model {
  nodes: Node<CardData>[]
  edges: Edge[]
  neighbours: Map<string, Set<string>>
}

function buildModel(openOnly: boolean): Model {
  const phaseList = [{ n: -1, name: phaseLabel(-1) }, ...phases]
  const specOrder = [...specs].sort((a, b) => (a.phase ?? 99) - (b.phase ?? 99) || a.id.localeCompare(b.id))
  const specIndex = new Map(specOrder.map((s, i) => [s.id, i]))

  const decs = decisions.filter((d) => d.specs.length > 0 && (!openOnly || d.status !== 'DECIDED'))
  const bary = (ids: string[]) => ids.reduce((n, id) => n + (specIndex.get(id) ?? 0), 0) / Math.max(ids.length, 1)
  decs.sort((a, b) => bary(a.specs) - bary(b.specs))
  const decIndex = new Map(decs.map((d, i) => [d.id, i]))
  const pocList = [...pocs].sort(
    (a, b) =>
      a.decisions.reduce((n, d) => n + (decIndex.get(d) ?? 0), 0) / Math.max(a.decisions.length, 1) -
      b.decisions.reduce((n, d) => n + (decIndex.get(d) ?? 0), 0) / Math.max(b.decisions.length, 1),
  )

  const height = Math.max(specOrder.length * 58, decs.length * 44, 600)
  const y = (i: number, n: number) => (n <= 1 ? height / 2 : (i * height) / n)

  const nodes: Node<CardData>[] = []
  const edges: Edge[] = []
  const add = (id: string, kind: Kind, i: number, n: number, code: string, title: string, color: string) =>
    nodes.push({ id, type: 'card', position: { x: COL_X[kind], y: y(i, n) }, data: { kind, code, title, color, dim: false, focus: false } })

  const usedPhases = phaseList.filter((p) => specs.some((s) => s.phase === p.n) || p.n === 4)
  usedPhases.forEach((p, i) => add(`phase:${p.n}`, 'phase', i, usedPhases.length, p.n === -1 ? '◆' : `P${p.n}`, p.name, 'var(--color-gold)'))
  specOrder.forEach((s, i) => add(`spec:${s.id}`, 'spec', i, specOrder.length, s.id, s.title, specStatusColor[s.status]))
  decs.forEach((d, i) => add(`dec:${d.id}`, 'decision', i, decs.length, d.id, d.question.replace(/\*\*/g, ''), decisionStatusColor[d.status]))
  pocList.forEach((p, i) => add(`poc:${p.id}`, 'poc', i, pocList.length, p.id, p.question, pocColor[p.result]))

  const edge = (source: string, target: string, color: string, animated = false) =>
    edges.push({
      id: `${source}->${target}`,
      source,
      target,
      animated,
      style: { stroke: color, strokeWidth: 1.5, opacity: 0.55 },
    })

  for (const s of specOrder) {
    if (s.phase !== null) edge(`phase:${s.phase}`, `spec:${s.id}`, 'var(--color-bark)')
    for (const d of s.decisions) {
      if (!decIndex.has(d)) continue
      const dec = decisionById.get(d)!
      edge(`spec:${s.id}`, `dec:${d}`, decisionStatusColor[dec.status], dec.status !== 'DECIDED')
    }
  }
  for (const p of pocList) for (const d of p.decisions) if (decIndex.has(d)) edge(`dec:${d}`, `poc:${p.id}`, pocColor[p.result])

  const neighbours = new Map<string, Set<string>>()
  for (const e of edges) {
    if (!neighbours.has(e.source)) neighbours.set(e.source, new Set())
    if (!neighbours.has(e.target)) neighbours.set(e.target, new Set())
    neighbours.get(e.source)!.add(e.target)
    neighbours.get(e.target)!.add(e.source)
  }
  return { nodes, edges, neighbours }
}

function Details({ id }: { id: string }) {
  const t = useDict(strings).graph
  const [kind, key] = id.split(':')
  if (kind === 'spec') {
    const s = specs.find((x) => x.id === key)!
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-2xl text-gold">{s.id}</span>
          <SpecBadge status={s.status} dark />
        </div>
        <p className="mt-1 text-parch-ink">{s.title}</p>
        <p className="mt-1 text-xs text-parch-dim">{phaseLabel(s.phase)}</p>
        <p className="mt-2 text-sm text-parch-dim">{t.blocksReady(s.blockers.length)}</p>
        <Link to={`/team/specs/${s.id}`} className="btn btn-leaf mt-3">
          {t.openSpec}
        </Link>
      </>
    )
  }
  if (kind === 'dec') {
    const d = decisionById.get(key)!
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-2xl text-gold">{d.id}</span>
          <DecisionBadge status={d.status} dark />
        </div>
        <p className="mt-1 text-parch-ink">
          <Inline text={d.question} />
        </p>
        <p className="mt-2 text-sm text-parch-dim">
          <Inline text={d.recommendation} />
        </p>
        <Link to={`/team/decisions#${d.id}`} className="btn btn-leaf mt-3">
          {t.openDecision}
        </Link>
      </>
    )
  }
  if (kind === 'poc') {
    const p = pocs.find((x) => x.id === key)!
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-2xl text-gold">{p.id}</span>
          <PocBadge result={p.result} dark />
        </div>
        <p className="mt-1 text-parch-ink">{p.question}</p>
        <p className="mt-2 text-sm text-parch-dim">
          {t.pass}
          {p.pass}
        </p>
        <Link to="/team/roadmap#pocs" className="btn btn-leaf mt-3">
          {t.roadmap}
        </Link>
      </>
    )
  }
  const n = Number(key)
  const count = specs.filter((s) => s.phase === n).length
  return (
    <>
      <span className="font-display text-2xl text-gold">{phaseLabel(n)}</span>
      <p className="mt-1 text-sm text-parch-dim">{t.nSpecs(count)}</p>
    </>
  )
}

export function Graph() {
  const t = useDict(strings).graph
  const [openOnly, setOpenOnly] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const model = useMemo(() => buildModel(openOnly), [openOnly])

  const { nodes, edges } = useMemo(() => {
    if (!selected || !model.neighbours.has(selected)) return model
    const near = new Set([selected, ...(model.neighbours.get(selected) ?? [])])
    return {
      nodes: model.nodes.map((n) => ({ ...n, data: { ...n.data, dim: !near.has(n.id), focus: n.id === selected } })),
      edges: model.edges.map((e) => {
        const on = e.source === selected || e.target === selected
        return { ...e, style: { ...e.style, opacity: on ? 1 : 0.06, strokeWidth: on ? 2.5 : 1 } }
      }),
    }
  }, [model, selected])

  return (
    <>
      <PageHeader kicker={t.kicker} title={t.title}>
        {t.intro}
      </PageHeader>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Legend
          items={[
            { label: t.legend.done, color: 'var(--color-st-done)' },
            { label: t.legend.open, color: 'var(--color-st-open)' },
            { label: t.legend.partly, color: 'var(--color-st-partly)' },
            { label: t.legend.testing, color: 'var(--color-st-ready)' },
            { label: t.legend.pending, color: 'var(--color-st-none)' },
          ]}
        />
        <div className="flex gap-2">
          <button className="btn text-xs" aria-pressed={openOnly} onClick={() => setOpenOnly((v) => !v)}>
            {t.openOnly}
          </button>
          {selected && (
            <button className="btn text-xs" onClick={() => setSelected(null)}>
              {t.clear}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="slate h-[70dvh] min-h-[480px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, n) => setSelected((cur) => (cur === n.id ? null : n.id))}
            onPaneClick={() => setSelected(null)}
            nodesDraggable={false}
            nodesConnectable={false}
            defaultViewport={{ x: 16, y: 16, zoom: 0.72 }}
            panOnScroll
            zoomOnScroll={false}
            minZoom={0.15}
            colorMode="dark"
            proOptions={{ hideAttribution: false }}
          >
            <Background color="#3a342b" gap={24} size={1.5} />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable maskColor="rgb(18 17 14 / 0.7)" style={{ background: 'var(--color-slate)' }} nodeColor={(n) => cssColor((n.data as CardData).color)} />
          </ReactFlow>
        </div>
        <aside className="slate p-4 lg:self-start">
          {selected ? (
            <Details id={selected} />
          ) : (
            <div className="text-sm text-parch-dim">
              <p className="font-display text-base text-gold">{t.columns}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>{t.col1}</li>
                <li>{t.col2}</li>
                <li>{t.col3(decisions.filter((d) => d.specs.length).length, decisions.length)}</li>
                <li>{t.col4}</li>
              </ol>
              <p className="mt-3">{t.select}</p>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
