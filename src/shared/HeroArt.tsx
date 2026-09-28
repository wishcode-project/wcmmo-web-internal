// Pixel-art dusk landscape for the hero banner. Drawn on a 160×60 grid with crisp edges.

const stars = [
  [8, 6], [21, 12], [34, 4], [47, 9], [63, 3], [77, 11], [92, 5], [104, 13], [118, 7], [131, 3], [146, 10], [154, 5], [27, 20], [85, 19], [139, 18],
]

/** Build a stepped ridge polygon from column heights (each column is `w` px wide). */
function ridge(heights: number[], w: number, base = 60) {
  let d = `M0 ${base}`
  heights.forEach((h, i) => {
    d += ` L${i * w} ${base - h} L${(i + 1) * w} ${base - h}`
  })
  return `${d} L${heights.length * w} ${base} Z`
}

const far = [18, 20, 23, 26, 30, 33, 31, 28, 25, 24, 27, 31, 35, 38, 36, 32, 28, 26, 24, 22]
const mid = [12, 14, 13, 16, 19, 21, 18, 16, 15, 17, 20, 23, 21, 18, 16, 14, 15, 17, 19, 22, 20, 17, 15, 13, 12, 14, 16, 18, 15, 12, 11, 13]
const trees = Array.from({ length: 40 }, (_, i) => 7 + ((i * 7) % 5) + (i % 3 === 0 ? 3 : 0))

export function HeroArt({ className = '', twinkle = false }: { className?: string; twinkle?: boolean }) {
  return (
    <svg viewBox="0 0 160 60" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" className={className} aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#141827" />
          <stop offset="0.55" stopColor="#3b2c3e" />
          <stop offset="0.85" stopColor="#8a4f3a" />
          <stop offset="1" stopColor="#c9804a" />
        </linearGradient>
      </defs>
      <rect width="160" height="60" fill="url(#sky)" />
      {stars.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill="#fff7cf"
          opacity={y % 2 ? 0.9 : 0.55}
          className={twinkle ? 'twinkle' : undefined}
          style={twinkle ? { animationDelay: `${(x * 7 + y * 13) % 40 / 10}s` } : undefined}
        />
      ))}
      {/* moon */}
      <rect x="124" y="8" width="6" height="6" fill="#fff7cf" />
      <rect x="123" y="9" width="8" height="4" fill="#fff7cf" />
      <rect x="126" y="9" width="2" height="2" fill="#e8d9ad" />
      <path d={ridge(far, 8)} fill="#4a3446" />
      <path d={ridge(mid, 5)} fill="#2e2331" />
      <path d={ridge(trees, 4)} fill="#1c2a1e" />
      <rect y="55" width="160" height="5" fill="#1a2415" />
      <rect y="55" width="160" height="1" fill="#88cc42" opacity="0.8" />
      {/* a lone tower with a lit window */}
      <rect x="110" y="34" width="6" height="21" fill="#221a1f" />
      <rect x="109" y="32" width="8" height="2" fill="#221a1f" />
      <rect x="109" y="31" width="1" height="1" fill="#221a1f" />
      <rect x="111" y="31" width="1" height="1" fill="#221a1f" />
      <rect x="114" y="31" width="1" height="1" fill="#221a1f" />
      <rect x="116" y="31" width="1" height="1" fill="#221a1f" />
      <rect x="112" y="38" width="2" height="2" fill="#ffc94b" />
    </svg>
  )
}
