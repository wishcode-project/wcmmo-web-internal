import type { IconName } from './config'

// 10×10 pixel icons. Each letter is a palette colour; '.' is transparent.
const palette: Record<string, string> = {
  w: '#fff7cf',
  s: '#c9d1d9',
  d: '#6b7280',
  b: '#8c5638',
  B: '#5a3420',
  g: '#ffc94b',
  r: '#d64a3a',
  R: '#8a2a22',
  l: '#88cc42',
  L: '#4f7d22',
  p: '#b39ae6',
  P: '#5e4a8a',
  c: '#5fb4ea',
  C: '#2a5f8a',
  k: '#2a1816',
}

const icons: Record<IconName, string[]> = {
  blood: ['....r.....', '....r.....', '...rrr....', '...rrr....', '..rrwrr...', '..rwrrrr..', '.rrrrrrrr.', '.rrrrrrRr.', '..rrrrRr..', '...RRRR...'],
  rune: ['....P.....', '...PpP....', '..PpwpP...', '.PppwppP..', 'PpppwpppP.', '.PppwppP..', '..PpwpP...', '...PpP....', '....P.....', '..........'],
  sword: ['........ss', '.......sws', '......sws.', '.....sws..', '.g..sws...', '..gsws....', '...gs.....', '..bdg.....', '.bb..g....', 'bb........'],
  shield: ['.dddddddd.', 'dssssssssd', 'dsccccccsd', 'dsccwcccsd', 'dscwwwccsd', 'dsccwcccsd', '.dsccccsd.', '.dssccssd.', '..dssssd..', '...dddd...'],
  gem: ['..cccccc..', '.cwwcccCc.', 'cwwccccCCc', 'cccccccCCc', '.cccccCCc.', '..ccccCc..', '...ccCc...', '....cc....', '..........', '..........'],
  skull: ['..wwwwww..', '.wwwwwwww.', 'wwwwwwwwww', 'wwkkwwkkww', 'wwkkwwkkww', 'wwwwkkwwww', '.wwwwwwww.', '..wkwkwk..', '..wwwwww..', '..........'],
  scroll: ['.bgggggg..', 'bgwwwwwwg.', '.gwkkkkwg.', '.gwwwwwwg.', '.gwkkkkwg.', '.gwwwwwwg.', '.gwkkkwwg.', '.gwwwwwwgb', '..ggggggb.', '..........'],
  house: ['....RR....', '...RRRR...', '..RRRRRR..', '.RRRRRRRR.', 'RRRRRRRRRR', '.wwwwwwww.', '.wccwwbbw.', '.wccwwbbw.', '.wwwwwbbw.', 'llllllllll'],
  pickaxe: ['.ssssss...', 'ss....ss..', 's...b..ss.', '....b...s.', '....b.....', '....b.....', '....b.....', '....B.....', '....B.....', '..........'],
}

export function PixelIcon({ name, className = 'size-10' }: { name: IconName; className?: string }) {
  const rows = icons[name]
  return (
    <svg viewBox="0 0 10 10" shapeRendering="crispEdges" className={className} aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => (palette[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} /> : null)),
      )}
    </svg>
  )
}
