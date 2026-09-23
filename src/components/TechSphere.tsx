import { useLayoutEffect, useMemo, useRef, useState } from "react"

type Tech = { name: string; logo: string | null }

const COLS_WIDE = [2, 3, 3, 3, 3, 3, 2]
const COLS_NARROW = [3, 4, 5, 4, 3]

export function TechSphere({
  techs,
  expanded,
  onToggle,
}: {
  techs: Tech[]
  expanded: string | null
  onToggle: (name: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(960)
  const [label, setLabel] = useState<{ name: string; x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const narrow = width < 640
  const size = narrow ? 52 : 84
  const pitch = size * 1.3
  const colCounts = narrow ? COLS_NARROW : COLS_WIDE
  const cols = colCounts.length
  const maxRows = Math.max(...colCounts)
  const radius = cols * pitch * 0.62
  const step = pitch / radius
  const stepLat = step * 0.9

  const RESERVED = 48
  const sphereHeight = maxRows * pitch * 0.95 + 24

  const cells = useMemo(() => {
    const maxDist = Math.hypot((cols / 2) * step, (maxRows / 2) * stepLat)
    const out: { key: string; tech: Tech; lon: number; lat: number; opacity: number }[] = []
    let i = 0
    for (let c = 0; c < cols; c++) {
      const n = colCounts[c]
      for (let r = 0; r < n; r++) {
        const lon = (c - (cols - 1) / 2) * step
        const lat = (r - (n - 1) / 2) * stepLat
        const dist = Math.hypot(lon, lat) / maxDist
        out.push({
          key: `${c}-${r}`,
          tech: techs[i++],
          lon,
          lat,
          opacity: Math.max(0.35, 1 - 0.65 * dist ** 2),
        })
      }
    }
    return out
  }, [colCounts, cols, maxRows, step, stepLat, techs])

  useLayoutEffect(() => {
    const container = ref.current
    const cell = expanded ? container?.querySelector<HTMLElement>(`[data-cell="${expanded}"]`) : null
    if (!container || !cell) {
      setLabel(null)
      return
    }
    const c = container.getBoundingClientRect()
    const r = cell.getBoundingClientRect()
    setLabel({
      name: cells.find((x) => x.key === expanded)?.tech.name ?? "",
      x: r.left - c.left + r.width / 2,
      y: r.bottom - c.top + 10,
    })
  }, [expanded, cells, width])

  return (
    <div ref={ref} className="relative mx-auto w-full" style={{ height: sphereHeight + RESERVED }}>
      <div
        className="absolute inset-x-0 top-0 [mask-image:radial-gradient(ellipse_58%_56%_at_center,#000_60%,transparent_100%)]"
        style={{ height: sphereHeight }}
      >
      <div className="absolute inset-0" style={{ perspective: radius * 2 }}>
        <div
          className="absolute top-1/2 left-1/2 h-0 w-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-radius}px)`,
          }}
        >
          {cells.map(({ key, tech, lon, lat, opacity }) => {
            const isExpanded = expanded === key
            return (
              <div
                key={key}
                data-cell={key}
                className="absolute"
                style={{
                  width: size,
                  height: size,
                  left: -size / 2,
                  top: -size / 2,
                  opacity,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transform: `rotateY(${lon}rad) rotateX(${-lat}rad) translateZ(${radius}px)`,
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={tech.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(key)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onToggle(key)
                    }
                  }}
                  className={`tech-item relative flex h-full w-full cursor-pointer items-center justify-center rounded-[14px] border border-border bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${
                    isExpanded ? "expanded" : expanded ? "dimmed" : ""
                  }`}
                >
                  {tech.logo ? (
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      draggable={false}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-[10px] font-semibold text-[#4B4B47]">{tech.name}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </div>
      {label && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-[3px] border border-border bg-white px-2 py-0.5 text-[11px] whitespace-nowrap text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          style={{ left: label.x, top: label.y }}
        >
          {label.name}
        </div>
      )}
    </div>
  )
}
