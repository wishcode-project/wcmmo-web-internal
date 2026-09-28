// Small, dependency-free helpers for reading the specs' markdown: sections and GFM tables.

export interface MdTable {
  /** nearest `##` heading above the table */
  section: string
  /** nearest `###` heading above the table (inside `section`), or '' */
  subsection: string
  headers: string[]
  rows: string[][]
}

/** Split a GFM table row on `|`, ignoring pipes inside backticks or escaped as `\|`. */
export function splitRow(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  let inCode = false
  const body = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '\\' && body[i + 1] === '|') {
      cur += '|'
      i++
    } else if (ch === '`') {
      inCode = !inCode
      cur += ch
    } else if (ch === '|' && !inCode) {
      cells.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  cells.push(cur.trim())
  return cells
}

const isDivider = (line: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line.trim())

export function parseTables(md: string): MdTable[] {
  const lines = md.split('\n')
  const tables: MdTable[] = []
  let section = ''
  let subsection = ''
  let inFence = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) continue
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      if (h[1].length <= 2) {
        section = h[2].trim()
        subsection = ''
      } else if (h[1].length === 3) subsection = h[2].trim()
      continue
    }
    if (line.trim().startsWith('|') && i + 1 < lines.length && isDivider(lines[i + 1])) {
      const headers = splitRow(line)
      const rows: string[][] = []
      let j = i + 2
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        rows.push(splitRow(lines[j]))
        j++
      }
      tables.push({ section, subsection, headers, rows })
      i = j - 1
    }
  }
  return tables
}

/** Text under a `##` heading whose title starts with `title` (case-insensitive), up to the next `##`. */
export function sectionText(md: string, title: string): string {
  const lines = md.split('\n')
  const want = title.toLowerCase()
  const start = lines.findIndex((l) => /^##\s/.test(l) && l.replace(/^##\s+/, '').toLowerCase().startsWith(want))
  if (start < 0) return ''
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##?\s/.test(lines[i])) {
      end = i
      break
    }
  }
  return lines.slice(start + 1, end).join('\n').trim()
}

/** Strip inline markdown so a cell reads as plain text. */
export function plain(s: string): string {
  return s
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/(^|[^*])\*(?!\s)(.*?)\*/g, '$1$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/⚠️\s?/g, '')
    .trim()
}

/** Expand "005–012, 014, 021–023" into ["005", …, "012", "014", "021", "022", "023"]. */
export function expandSpecRanges(s: string): string[] {
  const out: string[] = []
  for (const m of s.matchAll(/(\d{3})(?:\s*[–-]\s*(\d{3}))?/g)) {
    const a = Number(m[1])
    const b = m[2] ? Number(m[2]) : a
    for (let n = a; n <= b; n++) out.push(String(n).padStart(3, '0'))
  }
  return out
}

const decisionOrder = (id: string) => {
  const m = /^D-(\d+)([a-z]?)$/.exec(id)
  return m ? Number(m[1]) * 100 + (m[2] ? m[2].charCodeAt(0) - 96 : 0) : 99999
}

export const byDecisionId = (a: string, b: string) => decisionOrder(a) - decisionOrder(b)

/** All decision ids (D-03, D-03a, D-35b …) mentioned in a string, unique and ordered. */
export function decisionRefs(s: string): string[] {
  const set = new Set<string>()
  for (const m of s.matchAll(/\bD-(\d{2})([a-z]?)\b/g)) set.add(`D-${m[1]}${m[2]}`)
  // "D-31–D-34" style ranges
  for (const m of s.matchAll(/\bD-(\d{2})\s*[–-]\s*D-(\d{2})\b/g)) {
    for (let n = Number(m[1]); n <= Number(m[2]); n++) set.add(`D-${String(n).padStart(2, '0')}`)
  }
  return [...set].sort(byDecisionId)
}
