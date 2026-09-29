// Fails the build if private spec content can reach a public visitor:
//  1. a public JS file statically imports something under assets/team/ (the page would break,
//     and the fix is usually to leak the chunk), or
//  2. a public file contains text that only exists in the synced spec markdown.
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '..', 'dist')
const assets = join(dist, 'assets')
const publicFiles = [join(dist, 'index.html'), ...readdirSync(assets).filter((f) => f.endsWith('.js')).map((f) => join(assets, f))]

// Strings that appear in the specs but never in public copy.
// 'TEAM ONLY' marks spoiler sections of gdd/lore-bible.md: if it ever shows up here, story spoilers leaked.
const markers = ['FIRE mode', 'wcmmo_bloodline', 'wcmmo_item_', 'owner-questions', 'Implementation log', 'MythicMobs', 'TEAM ONLY']

const problems = []
for (const file of publicFiles) {
  const src = readFileSync(file, 'utf8')
  if (/from\s*"\.\/team\//.test(src)) problems.push(`${file}: static import of a team chunk`)
  for (const m of markers) if (src.includes(m)) problems.push(`${file}: contains private text "${m}"`)
}

if (problems.length) {
  console.error('[check-bundle] private content would be public:\n  ' + problems.join('\n  '))
  process.exit(1)
}
console.log(`[check-bundle] ok: ${publicFiles.length} public files clean`)
