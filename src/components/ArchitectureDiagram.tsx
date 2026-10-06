import { useMemo, useState } from "react"
import { edgeLabel, type ArchEdge, type ArchNode, type Architecture, type EdgeKind } from "@/data/architecture"

const STROKE: Record<EdgeKind, { dash?: string; width: number; base: number }> = {
  route: { width: 1, base: 0.22 },
  sync: { width: 1.4, base: 0.55 },
  event: { dash: "7 5", width: 1.3, base: 0.5 },
  queue: { dash: "1.5 5", width: 2, base: 0.55 },
  dep: { width: 1, base: 0.24 },
  uses: { dash: "3 4", width: 1, base: 0.32 },
}

type Point = { x: number; y: number }

function endpoint(id: string, other: Point, arch: Architecture, nodes: Map<string, ArchNode>): Point {
  if (id === "box" && arch.box) {
    const { x, y, h } = arch.box
    return { x, y: Math.min(Math.max(other.y, y + 40), y + h - 40) }
  }
  const n = nodes.get(id)
  return n ? { x: n.x, y: n.y } : other
}

function path(a: Point, b: Point, bend = 0, trim = 12) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const start = { x: a.x + ux * trim, y: a.y + uy * trim }
  const end = { x: b.x - ux * trim, y: b.y - uy * trim }
  if (!bend) return `M${start.x},${start.y} L${end.x},${end.y}`
  const cx = (a.x + b.x) / 2
  const cy = (a.y + b.y) / 2 + bend
  return `M${start.x},${start.y} Q${cx},${cy} ${end.x},${end.y}`
}

function Legend({ kinds }: { kinds: EdgeKind[] }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {kinds.map((k) => (
        <li key={k} className="flex items-center gap-2.5 text-[14px] text-muted">
          <svg width="34" height="8" aria-hidden>
            <line
              x1="1"
              y1="4"
              x2="33"
              y2="4"
              stroke="currentColor"
              strokeWidth={STROKE[k].width}
              strokeDasharray={STROKE[k].dash}
              strokeLinecap="round"
              className="text-foreground"
            />
          </svg>
          {edgeLabel[k]}
        </li>
      ))}
    </ul>
  )
}

function Node({ node, state, onEnter }: { node: ArchNode; state: "on" | "near" | "off" | "idle"; onEnter: () => void }) {
  const dim = state === "off"
  const filled = node.kind === "service" || node.kind === "module"
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${node.label}: ${node.desc}`}
      onPointerEnter={onEnter}
      onFocus={onEnter}
      onClick={onEnter}
      className="cursor-pointer outline-none transition-opacity duration-300"
      style={{ opacity: dim ? 0.28 : 1 }}
    >
      <circle cx={node.x} cy={node.y} r={26} fill="transparent" />
      {state === "on" && <circle cx={node.x} cy={node.y} r={15} fill="none" stroke="var(--foreground)" strokeOpacity={0.35} />}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.kind === "external" ? 5 : 7}
        fill={filled ? "var(--foreground)" : "var(--background)"}
        stroke="var(--foreground)"
        strokeWidth={filled ? 0 : 1.4}
        strokeDasharray={node.kind === "external" ? "2 2" : undefined}
        style={filled ? { filter: "drop-shadow(0 0 6px rgba(237,237,233,0.6))" } : undefined}
      />
      <text
        x={node.x}
        y={node.y + 28}
        textAnchor="middle"
        className="fill-foreground font-sans"
        style={{ fontSize: 15, paintOrder: "stroke", stroke: "var(--background)", strokeWidth: 6, strokeLinejoin: "round" }}
      >
        {node.label}
      </text>
      {node.sub && (
        <text
          x={node.x}
          y={node.y + 45}
          textAnchor="middle"
          className="fill-muted font-mono"
          style={{ fontSize: 11, paintOrder: "stroke", stroke: "var(--background)", strokeWidth: 6, strokeLinejoin: "round" }}
        >
          {node.sub}
        </text>
      )}
      {node.db && (
        <rect
          x={node.x + (node.sub?.length ?? 0) * 3.4 + 7}
          y={node.y + 37}
          width={8}
          height={8}
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity={0.7}
        />
      )}
    </g>
  )
}

export function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  const [active, setActive] = useState<string | null>(null)
  const nodes = useMemo(() => new Map(arch.nodes.map((n) => [n.id, n])), [arch])
  const touches = (e: ArchEdge, id: string) => e.from === id || e.to === id
  const near = useMemo(() => {
    const set = new Set<string>()
    if (!active) return set
    arch.edges.forEach((e) => {
      if (e.from === active) set.add(e.to)
      if (e.to === active) set.add(e.from)
    })
    return set
  }, [active, arch])
  const current = active ? nodes.get(active) : null
  const hasDb = arch.nodes.some((n) => n.db)

  return (
    <div>
      <div className="thin-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0" onPointerLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${arch.width} ${arch.height}`} className="block w-full min-w-[760px]" role="img" aria-label={arch.caption}>
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--foreground)" fillOpacity={0.7} />
            </marker>
          </defs>

          {arch.box && (
            <g>
              <rect
                x={arch.box.x}
                y={arch.box.y}
                width={arch.box.w}
                height={arch.box.h}
                fill="none"
                stroke="var(--foreground)"
                strokeOpacity={0.18}
                strokeDasharray="4 6"
              />
              <text x={arch.box.x + 18} y={arch.box.y + 26} className="fill-muted font-mono" style={{ fontSize: 11, letterSpacing: 1.5 }}>
                {arch.box.label.toUpperCase()}
              </text>
            </g>
          )}

          {arch.edges.map((e) => {
            const a = endpoint(e.from, nodes.get(e.to) ?? { x: 0, y: 0 }, arch, nodes)
            const b = endpoint(e.to, nodes.get(e.from) ?? { x: 0, y: 0 }, arch, nodes)
            const s = STROKE[e.kind]
            const lit = active ? touches(e, active) : false
            const opacity = active ? (lit ? 0.95 : 0.06) : s.base
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={path(a, b, e.bend, e.from === "box" ? 2 : 12)}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={lit ? s.width + 0.4 : s.width}
                strokeDasharray={lit && !s.dash ? "6 6" : s.dash}
                strokeLinecap="round"
                markerEnd="url(#arrow)"
                markerStart={e.both ? "url(#arrow)" : undefined}
                className={`transition-[stroke-opacity] duration-300 ${lit ? "motion-safe:animate-[flow_1.2s_linear_infinite]" : ""}`}
                style={{ strokeOpacity: opacity }}
              />
            )
          })}

          {arch.nodes.map((n) => (
            <Node
              key={n.id}
              node={n}
              state={!active ? "idle" : active === n.id ? "on" : near.has(n.id) ? "near" : "off"}
              onEnter={() => setActive(n.id)}
            />
          ))}
        </svg>
      </div>

      <div className="mt-6 grid gap-6 border-t border-line pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <Legend kinds={arch.legend} />
          {hasDb && (
            <p className="flex items-center gap-2.5 text-[14px] text-muted">
              <span className="inline-block size-2 border border-foreground/70" />
              banco próprio (PostgreSQL)
            </p>
          )}
        </div>
        <div className="min-h-[72px]">
          {current ? (
            <>
              <p className="font-serif text-[30px] leading-none">{current.label}</p>
              <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{current.desc}</p>
            </>
          ) : (
            <p className="text-[16px] leading-relaxed text-muted">
              Passe o mouse ou toque num ponto para ver o que ele faz e com quem conversa.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
