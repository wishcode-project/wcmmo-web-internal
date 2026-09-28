// Copies the markdown from the wcmmo-specs repo into content/ and records git metadata.
// The site is built from content/, so it also builds where the specs repo is absent (Vercel):
// run `npm run sync` locally, commit content/, push, and Vercel redeploys.
//
//   SPECS_DIR=/path/to/wcmmo-specs npm run sync   (default: ../wcmmo-specs)
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const specsDir = resolve(root, process.env.SPECS_DIR ?? '../wcmmo-specs')
const out = join(root, 'content')

if (!existsSync(join(specsDir, 'docs', 'README.md'))) {
  console.log(`[sync] no specs repo at ${specsDir}, using committed content/`)
  process.exit(0)
}

rmSync(out, { recursive: true, force: true })

const copyMarkdown = (from, to) => {
  if (!existsSync(from)) return 0
  mkdirSync(to, { recursive: true })
  let n = 0
  for (const name of readdirSync(from)) {
    if (!name.endsWith('.md')) continue
    cpSync(join(from, name), join(to, name))
    n++
  }
  return n
}

const counts = {
  docs: copyMarkdown(join(specsDir, 'docs'), join(out, 'docs')),
  adr: copyMarkdown(join(specsDir, 'docs', 'adr'), join(out, 'docs', 'adr')),
  gdd: copyMarkdown(join(specsDir, 'gdd'), join(out, 'gdd')),
}
cpSync(join(specsDir, 'CONTEXT.md'), join(out, 'CONTEXT.md'))

const git = (...args) => {
  try {
    return execFileSync('git', ['-C', specsDir, ...args], { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const commits = git('log', '--date=iso-strict', '--pretty=format:%h\x1f%ad\x1f%an\x1f%s', '--shortstat')
  .split('\n')
  .reduce((list, line) => {
    if (line.includes('\x1f')) {
      const [sha, date, author, subject] = line.split('\x1f')
      list.push({ sha, date, author, subject, insertions: 0, deletions: 0, files: 0 })
    } else if (line.trim() && list.length) {
      const last = list[list.length - 1]
      last.files = Number(line.match(/(\d+) files? changed/)?.[1] ?? 0)
      last.insertions = Number(line.match(/(\d+) insertions?/)?.[1] ?? 0)
      last.deletions = Number(line.match(/(\d+) deletions?/)?.[1] ?? 0)
    }
    return list
  }, [])

// Last commit that touched each file, so the site can show "updated" per spec.
const fileDates = {}
for (const dir of ['docs', 'docs/adr', 'gdd']) {
  const abs = join(specsDir, dir)
  if (!existsSync(abs)) continue
  for (const name of readdirSync(abs).filter((n) => n.endsWith('.md'))) {
    const rel = `${dir}/${name}`
    fileDates[rel] = git('log', '-1', '--date=iso-strict', '--pretty=format:%ad', '--', rel) || null
  }
}

writeFileSync(
  join(out, 'meta.json'),
  JSON.stringify(
    { syncedAt: new Date().toISOString(), head: git('rev-parse', '--short', 'HEAD'), branch: git('rev-parse', '--abbrev-ref', 'HEAD'), commits, fileDates },
    null,
    2,
  ) + '\n',
)

// ── Public stats ────────────────────────────────────────────────────────────
// Numbers only, for the public site. It must never import the markdown itself (that ships
// the private specs to everyone), so the few counts it shows are computed here.
const read = (rel) => (existsSync(join(out, rel)) ? readFileSync(join(out, rel), 'utf8') : '')
const specFiles = readdirSync(join(out, 'docs')).filter((n) => /^\d{3}-.*\.md$/.test(n) && !n.startsWith('000-'))
const specStatus = Object.fromEntries(
  specFiles.map((n) => [n.slice(0, 3), (/^>\s*Status:\s*([A-Z-]+)/m.exec(read(`docs/${n}`))?.[1] ?? 'DRAFT').toUpperCase()]),
)
const expand = (s) =>
  [...s.matchAll(/(\d{3})(?:\s*[–-]\s*(\d{3}))?/g)].flatMap((m) => {
    const a = Number(m[1])
    const b = m[2] ? Number(m[2]) : a
    return Array.from({ length: b - a + 1 }, (_, i) => String(a + i).padStart(3, '0'))
  })
const tableRows = (md, heading) => {
  const start = md.search(new RegExp(`^##\\s+${heading}`, 'm'))
  if (start < 0) return []
  const rest = md.slice(start).split('\n').slice(1)
  const end = rest.findIndex((l) => /^##\s/.test(l))
  return (end < 0 ? rest : rest.slice(0, end))
    .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
    .slice(1)
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
}
const roadmap = read('docs/004-roadmap-phase-plan.md')
const phases = tableRows(roadmap, 'Phases').map((r) => {
  const ids = r[2] === 'this spec' ? ['004'] : expand(r[2] ?? '').filter((id) => id in specStatus)
  return { n: Number(r[0].match(/\d+/)?.[0] ?? -1), specsDone: ids.filter((id) => specStatus[id] === 'DONE').length, specsTotal: ids.length }
})
const foundation = Object.keys(specStatus).filter((id) => Number(id) <= 3)
const pocTotal = tableRows(roadmap, 'Proof-of-concepts').filter((r) => /PoC-\d/.test(r[0])).length
const pocDone = tableRows(roadmap, 'PoC results').filter((r) => /^(PASS|FALLBACK)/i.test((r[2] ?? '').replace(/\*/g, ''))).length
const decisionRows = read('gdd/wcmmo-gdd-v2.md')
  .split('\n')
  .filter((l) => /^\|\s*D-\d/.test(l))
  .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
  .filter((r) => r.length >= 6)

writeFileSync(
  join(out, 'public-stats.json'),
  JSON.stringify(
    {
      updatedAt: commits[0]?.date ?? new Date().toISOString(),
      specs: { done: Object.values(specStatus).filter((s) => s === 'DONE').length, total: specFiles.length },
      foundation: { done: foundation.filter((id) => specStatus[id] === 'DONE').length, total: foundation.length },
      phases,
      prototypes: { done: pocDone, total: pocTotal },
      decisions: { locked: decisionRows.filter((r) => /DECIDED/.test(r[r.length - 1])).length, total: decisionRows.length },
    },
    null,
    2,
  ) + '\n',
)

console.log(`[sync] ${counts.docs} specs/docs, ${counts.adr} ADRs, ${counts.gdd} GDD files, ${commits.length} commits from ${specsDir}`)
