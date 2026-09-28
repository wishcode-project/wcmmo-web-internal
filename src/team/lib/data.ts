// Builds the site's data model from the synced markdown in content/ (see scripts/sync-specs.mjs).
// Everything is parsed at build time from the same files the team edits, so the site never drifts
// from the specs repo: re-sync, commit, deploy.
import metaJson from '../../../content/meta.json'
import { currentLang } from '../../shared/i18n'
import { byDecisionId, decisionRefs, expandSpecRanges, parseTables, plain, sectionText, type MdTable } from './markdown'

const raw = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/** Markdown by repo-relative path, e.g. `docs/021-bloodlines.md`. */
export const files: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([k, v]) => [k.replace(/^\/content\//, ''), v]),
)

export interface Commit {
  sha: string
  date: string
  author: string
  subject: string
  insertions: number
  deletions: number
  files: number
}

export const meta = metaJson as {
  syncedAt: string
  head: string
  branch: string
  commits: Commit[]
  fileDates: Record<string, string | null>
}

// ── Decisions ───────────────────────────────────────────────────────────────

export type DecisionStatus = 'DECIDED' | 'PARTLY' | 'TESTING' | 'OPEN'

export interface Decision {
  id: string
  question: string
  options: string
  recommendation: string
  answer: string
  status: DecisionStatus
  rawStatus: string
  area: string
  /** spec ids that mention this decision */
  specs: string[]
}

const gdd = files['gdd/wcmmo-gdd-v2.md'] ?? ''
const gddTables = parseTables(gdd)

const areaName = (section: string) => {
  const s = section.replace(/^\d+\.\s*/, '').trim()
  if (/^vision/i.test(s)) return 'Project & stack'
  return s
    .replace(/\s*\(.*\)$/, '')
    .replace(/:.*$/, '')
    .replace(/^Classless system, /, '')
    .replace(/^Weapon freedom & compartmentalised progression$/, 'Weapons, stats & mastery')
    .replace(/^Farming zones, monster tiers, bosses & dungeons$/, 'Zones, farming & bosses')
    .replace(/^Core vitality & survival$/, 'Vitality')
}

const normStatus = (s: string): DecisionStatus => {
  const t = plain(s).toUpperCase()
  if (t.startsWith('DECIDED')) return 'DECIDED'
  if (t.startsWith('PARTLY')) return 'PARTLY'
  if (t.includes('TESTING')) return 'TESTING'
  return 'OPEN'
}

export const decisions: Decision[] = gddTables
  .filter((t) => t.headers[0] === 'ID' && t.headers.includes('Status'))
  .flatMap((t) =>
    t.rows
      .filter((r) => /^D-\d/.test(r[0]))
      .map((r) => ({
        id: r[0].trim(),
        question: r[1] ?? '',
        options: r[2] ?? '',
        recommendation: r[3] ?? '',
        answer: r[4] ?? '',
        rawStatus: plain(r[5] ?? ''),
        status: normStatus(r[5] ?? ''),
        area: areaName(t.section),
        specs: [] as string[],
      })),
  )
  .sort((a, b) => byDecisionId(a.id, b.id))

export const decisionById = new Map(decisions.map((d) => [d.id, d]))

export interface DecisionLogEntry {
  date: string
  ids: string[]
  text: string
  by: string
}

export const decisionLog: DecisionLogEntry[] = (gddTables.find((t) => /decision log/i.test(t.section))?.rows ?? []).map((r) => ({
  date: r[0],
  ids: decisionRefs(r[1] ?? ''),
  text: r[2] ?? '',
  by: r[3] ?? '',
}))

// ── Roadmap (spec 004 + GDD phase plan) ─────────────────────────────────────

const roadmap = files['docs/004-roadmap-phase-plan.md'] ?? ''
const roadmapTables = parseTables(roadmap)
const tableIn = (tables: MdTable[], section: RegExp) => tables.find((t) => section.test(t.section))

export interface Phase {
  key: string
  n: number
  name: string
  goal: string
  specs: string[]
  exit: string
}

export const phases: Phase[] = (tableIn(roadmapTables, /^Phases/)?.rows ?? []).map((r) => {
  const [n, name] = plain(r[0]).split(/\s*[—:-]\s*/)
  return { key: `P${n}`, n: Number(n), name: name ?? r[0], goal: r[1], specs: expandSpecRanges(r[2] === 'this spec' ? '004' : r[2]), exit: r[3] }
})

export type PocResult = 'PENDING' | 'PASS' | 'FALLBACK' | 'FAIL'

export interface Poc {
  id: string
  question: string
  pass: string
  fallback: string
  spec: string
  decisions: string[]
  result: PocResult
  date: string
  notes: string
}

const pocResults = new Map(
  (tableIn(roadmapTables, /^PoC results/)?.rows ?? [])
    .filter((r) => r[0])
    .map((r) => [plain(r[0]), { date: r[1] ?? '', result: plain(r[2] ?? '').toUpperCase(), notes: r[4] ?? '' }]),
)

export const pocs: Poc[] = (tableIn(roadmapTables, /^Proof-of-concepts/)?.rows ?? [])
  .map((r) => {
    const id = plain(r[0])
    const res = pocResults.get(id)
    const result = (['PASS', 'FALLBACK', 'FAIL'].find((k) => res?.result.startsWith(k)) ?? 'PENDING') as PocResult
    return { id, question: r[1], pass: r[2], fallback: r[3], spec: plain(r[4]), decisions: decisionRefs(r[5] ?? ''), result, date: res?.date ?? '', notes: res?.notes ?? '' }
  })
  .sort((a, b) => Number(a.id.replace(/\D/g, '')) - Number(b.id.replace(/\D/g, '')))

export interface Prereq {
  id: string
  item: string
  repo: string
  owner: string
}

export const prereqs: Prereq[] = (tableIn(roadmapTables, /^Prerequisites/)?.rows ?? []).map((r) => ({ id: r[0], item: r[1], repo: r[2], owner: r[3] }))

/** Vertical-slice window from spec 004's timeline row: "2–3 weeks from 2026-09-28". */
export const sliceWindow = (() => {
  const m = /(\d+)\s*[–-]\s*(\d+)\s*weeks from (\d{4}-\d{2}-\d{2})/.exec(roadmap)
  if (!m) return null
  const start = new Date(`${m[3]}T00:00:00`)
  const addDays = (d: number) => new Date(start.getTime() + d * 86_400_000)
  return { start, early: addDays(Number(m[1]) * 7), late: addDays(Number(m[2]) * 7) }
})()

// ── Specs ───────────────────────────────────────────────────────────────────

export type SpecStatus = 'DRAFT' | 'READY' | 'IN-PROGRESS' | 'DONE' | 'SUPERSEDED'
export const SPEC_STATUSES: SpecStatus[] = ['DRAFT', 'READY', 'IN-PROGRESS', 'DONE', 'SUPERSEDED']

export interface Spec {
  id: string
  slug: string
  path: string
  title: string
  status: SpecStatus
  target: string
  repos: string[]
  fireMode: string
  story: string
  doneMeans: string
  /** every decision the spec mentions */
  decisions: string[]
  /** cited decisions that are not DECIDED yet: a spec can't be READY while any exist */
  blockers: string[]
  acceptance: { done: number; total: number }
  openQuestions: string[]
  implLog: number
  related: string[]
  phase: number | null
  pocs: string[]
  updated: string | null
  body: string
}

const repoOf = (part: string) => {
  const p = part.trim().toLowerCase()
  if (p === 'all') return ['wcmmo', 'wcmmo-plugins', 'wcmmo-content']
  if (p === 'content') return ['wcmmo-content']
  if (p === 'plugins') return ['wcmmo-plugins']
  if (p === 'infra') return ['wcmmo-infra']
  const m = /^(wcmmo(?:-[a-z]+)?)/.exec(p)
  return m ? [m[1]] : []
}

const parseSpec = (path: string, md: string): Spec => {
  const file = path.split('/').pop()!
  const id = file.slice(0, 3)
  const title = (/^#\s+\d{3}\s*[—-]\s*(.*)$/m.exec(md)?.[1] ?? file).trim()
  const metaLine = /^>\s*Status:(.*)$/m.exec(md)?.[1] ?? ''
  const fields = Object.fromEntries(
    ('Status:' + metaLine).split('·').map((p) => {
      const i = p.indexOf(':')
      return [p.slice(0, i).trim().toLowerCase(), p.slice(i + 1).trim()]
    }),
  )
  const rawStatus = plain(fields.status ?? 'DRAFT').toUpperCase()
  const status = (rawStatus.startsWith('SUPERSEDED') ? 'SUPERSEDED' : (SPEC_STATUSES.find((s) => rawStatus.startsWith(s)) ?? 'DRAFT')) as SpecStatus
  const target = plain(fields.target ?? '')
  const repos = [...new Set(target.replace(/\([^)]*\)/g, '').split(',').flatMap(repoOf))]

  const big = sectionText(md, 'Big picture')
  const story = plain(/\*\*(?:Player )?story:\*\*\s*(.*)/i.exec(big)?.[1] ?? '')
  const doneMeans = plain(/\*\*Done means:\*\*\s*(.*)/i.exec(big)?.[1] ?? '')

  const known = (ids: string[]) => ids.filter((d) => decisionById.has(d))
  const decs = known(decisionRefs(md))
  const blockers = decs.filter((d) => decisionById.get(d)!.status !== 'DECIDED')

  const acc = sectionText(md, 'Acceptance criteria')
  const boxes = [...acc.matchAll(/^\s*- \[([ xX])\]/gm)]

  const oq = sectionText(md, 'Open questions')
    .split('\n')
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, ''))
    .filter((l) => !/^none\b/i.test(l.trim()))

  const logRows = parseTables(md).find((t) => /^Implementation log/i.test(t.section))?.rows ?? []
  const implLog = logRows.filter((r) => r.some((c) => c && c !== '—')).length

  const related = new Set<string>()
  for (const m of md.matchAll(/\((\d{3})-[a-z0-9-]+\.md/g)) related.add(m[1])
  for (const m of md.matchAll(/\bspecs? (\d{3})\b/gi)) related.add(m[1])
  related.delete(id)

  return {
    id,
    slug: file.replace(/\.md$/, ''),
    path,
    title,
    status,
    target,
    repos,
    fireMode: plain(fields['fire mode'] ?? ''),
    story,
    doneMeans,
    decisions: decs,
    blockers,
    acceptance: { done: boxes.filter((b) => b[1] !== ' ').length, total: boxes.length },
    openQuestions: oq,
    implLog,
    related: [...related].sort(),
    phase: null,
    pocs: [],
    updated: meta.fileDates[path] ?? null,
    body: md,
  }
}

export const specs: Spec[] = Object.entries(files)
  .filter(([p]) => /^docs\/\d{3}-.*\.md$/.test(p) && !p.startsWith('docs/000-'))
  .map(([p, md]) => parseSpec(p, md))
  .sort((a, b) => a.id.localeCompare(b.id))

export const specById = new Map(specs.map((s) => [s.id, s]))

for (const s of specs) {
  if (Number(s.id) <= 3) s.phase = -1 // foundation work that predates the phase plan
  const ph = phases.find((p) => p.specs.includes(s.id))
  if (ph && s.phase === null) s.phase = ph.n
  s.pocs = pocs.filter((p) => p.spec === s.id).map((p) => p.id)
  for (const d of s.decisions) decisionById.get(d)?.specs.push(s.id)
}
for (const s of specs) s.related = s.related.filter((r) => specById.has(r))

export const phaseLabel = (n: number | null) => {
  const th = currentLang === 'th'
  if (n === -1) return th ? 'รากฐาน' : 'Foundation'
  const p = phases.find((x) => x.n === n)
  if (!p) return th ? 'ยังไม่จัดเฟส' : 'Unphased'
  return th ? `เฟส ${p.n}: ${p.name}` : `Phase ${p.n}: ${p.name}`
}

// ── Owner questions ─────────────────────────────────────────────────────────

export interface OwnerQuestion {
  id: string
  question: string
  ref: string
  group: string
  answered: boolean
}

const oqMd = files['gdd/owner-questions.md'] ?? ''
const oqTables = parseTables(oqMd)

export const ownerQuestions: OwnerQuestion[] = oqTables
  .filter((t) => /^Pending/i.test(t.section) && t.headers[0] === '#')
  .flatMap((t) =>
    t.rows.map((r) => ({
      id: plain(r[0]),
      question: r[1],
      ref: r[2] ?? '',
      group: t.section.replace(/^Pending:\s*/i, '').replace(/\s*\(.*\)$/, ''),
      answered: /~~/.test(r[0]) || /\*\*Answered/i.test(r[1]),
    })),
  )

export interface AnsweredItem {
  topic: string
  answer: string
  where: string
}

export const answered: AnsweredItem[] = (oqTables.find((t) => /^Answered/i.test(t.section))?.rows ?? []).map((r) => ({
  topic: r[0],
  answer: r[1],
  where: r[2],
}))
export const answeredOn = /^## Answered:\s*(.*)$/m.exec(oqMd)?.[1] ?? ''

export interface TeamMember {
  person: string
  role: string
  owns: string
}

export const team: TeamMember[] = (oqTables.find((t) => /^Team/i.test(t.section))?.rows ?? []).map((r) => ({ person: plain(r[0]), role: r[1], owns: r[2] }))

export interface PluginCheck {
  plugin: string
  cells: string[]
}

const pluginPending = oqTables.find((t) => /^Pending: plugins/i.test(t.section))
export const pluginChecklist = { headers: pluginPending?.headers ?? [], rows: pluginPending?.rows ?? [] }

// ── Plugins ─────────────────────────────────────────────────────────────────

export interface Plugin {
  name: string
  category: string
  status: string
  statusKey: 'installed' | 'owned' | 'to buy' | 'free' | 'parked' | 'undecided' | 'to write' | 'other'
  version: string
  support: string
  usedFor: string
  specs: string[]
}

const statusKey = (s: string): Plugin['statusKey'] => {
  const t = plain(s).toLowerCase()
  if (t.startsWith('installed')) return 'installed'
  if (t.startsWith('to buy')) return 'to buy'
  if (t.startsWith('parked')) return 'parked'
  if (t.startsWith('undecided')) return 'undecided'
  if (t.startsWith('to write')) return 'to write'
  if (t.startsWith('owned')) return 'owned'
  if (t.startsWith('free')) return 'free'
  return 'other'
}

export const plugins: Plugin[] = (parseTables(files['docs/plugins.md'] ?? '').find((t) => /overview/i.test(t.section))?.rows ?? []).map((r) => ({
  name: plain(r[0]),
  category: r[1],
  status: plain(r[2]),
  statusKey: statusKey(r[2]),
  version: r[3],
  support: r[4],
  usedFor: r[5],
  specs: expandSpecRanges(r[6] ?? ''),
}))

// ── ADRs & reading room ─────────────────────────────────────────────────────

export interface Adr {
  id: string
  title: string
  status: string
  date: string
  path: string
}

export const adrs: Adr[] = Object.entries(files)
  .filter(([p]) => p.startsWith('docs/adr/'))
  .map(([p, md]) => ({
    id: p.split('/').pop()!.slice(0, 4),
    title: (/^#\s+ADR\s+\d+\s*[—-]\s*(.*)$/m.exec(md)?.[1] ?? p).trim(),
    status: /^- Status:\s*(.*)$/m.exec(md)?.[1] ?? '',
    date: /^- Date:\s*(.*)$/m.exec(md)?.[1] ?? '',
    path: p,
  }))
  .sort((a, b) => a.id.localeCompare(b.id))

export interface Doc {
  path: string
  title: string
  group: 'Design' | 'Registry' | 'ADR' | 'Brief'
  note?: string
}

const docTitle = (md: string, fallback: string) => plain(/^#\s+(.*)$/m.exec(md)?.[1] ?? fallback)

export const docs: Doc[] = [
  { path: 'gdd/wcmmo-gdd-v2.md', group: 'Design' as const },
  { path: 'CONTEXT.md', group: 'Brief' as const },
  { path: 'gdd/team-brief-2026-09-28.md', group: 'Brief' as const },
  { path: 'gdd/owner-questions.md', group: 'Design' as const },
  { path: 'docs/README.md', group: 'Registry' as const },
  { path: 'docs/plugins.md', group: 'Registry' as const },
  ...adrs.map((a) => ({ path: a.path, group: 'ADR' as const })),
  { path: 'gdd/wcmmo-gdd-v1.md', group: 'Design' as const, note: 'superseded by v2' },
]
  .filter((d) => files[d.path])
  .map((d) => ({ ...d, title: docTitle(files[d.path], d.path) }))

/** Route for a repo-relative markdown path. */
export const routeFor = (path: string) => {
  const m = /^docs\/(\d{3})-/.exec(path)
  if (m && specById.has(m[1])) return `/team/specs/${m[1]}`
  return `/team/read/${path.replace(/\.md$/, '')}`
}

// ── Roll-ups for the dashboard ──────────────────────────────────────────────

export const counts = {
  specs: specs.length,
  specsByStatus: Object.fromEntries(SPEC_STATUSES.map((s) => [s, specs.filter((x) => x.status === s).length])) as Record<SpecStatus, number>,
  decided: decisions.filter((d) => d.status === 'DECIDED').length,
  decisionsOpen: decisions.filter((d) => d.status !== 'DECIDED').length,
  pocsPassed: pocs.filter((p) => p.result === 'PASS' || p.result === 'FALLBACK').length,
  questionsPending: ownerQuestions.filter((q) => !q.answered).length,
  acceptanceDone: specs.reduce((n, s) => n + s.acceptance.done, 0),
  acceptanceTotal: specs.reduce((n, s) => n + s.acceptance.total, 0),
  readyable: specs.filter((s) => s.status === 'DRAFT' && s.blockers.length === 0).length,
}

export const decisionAreas = [...new Set(decisions.map((d) => d.area))]
