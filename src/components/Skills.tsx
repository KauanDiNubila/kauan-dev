import { useMemo, useState } from "react"
import { categories, type Skill } from "@/data/skills"
import { useDesktop } from "@/hooks/useDesktop"
import { useSectionReveal } from "@/hooks/useSectionReveal"

const W = 1200
const STEP = 52
const TOP = 70
const COLUMNS = [40, 345, 650, 930]
const rows = Math.max(...categories.map((c) => c.skills.length))
const H = TOP + (rows - 1) * STEP + 50

const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

type Star = Skill & { x: number; y: number; category: string; c: number }

function layout(): Star[] {
  return categories.flatMap((cat, c) => {
    return cat.skills.map((s, i) => ({
      ...s,
      category: cat.title,
      c,
      x: COLUMNS[c] + 12 + (i % 2 ? 46 : 0) + (hash(c * 31 + i) - 0.5) * 40,
      y: TOP + i * STEP + (hash(c * 17 + i * 3) - 0.5) * 16,
    }))
  })
}

function Evidence({ skill }: { skill: Skill }) {
  if (!skill.used) return <p className="text-[16px] text-muted">Também faz parte do meu stack.</p>
  return (
    <ul className="flex flex-col gap-2">
      {skill.used.map((u) => (
        <li key={u.project} className="flex gap-3 text-[16px] leading-snug text-foreground/90">
          <span className="w-12 shrink-0 font-mono text-[12px] leading-[22px] tracking-[0.1em] text-muted uppercase">
            {u.project}
          </span>
          {u.text}
        </li>
      ))}
    </ul>
  )
}

function Constellation() {
  const stars = useMemo(layout, [])
  const [active, setActive] = useState<Star | null>(null)

  return (
    <div data-reveal>
      <p className="mb-10 max-w-[520px] text-[16px] text-muted">
        Passe o mouse numa estrela para ver onde a tecnologia foi usada. As mais brilhantes têm o uso detalhado nos
        projetos.
      </p>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} onPointerLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
          {stars.map((s, i) => {
            const next = stars[i + 1]
            if (!next || next.c !== s.c) return null
            const lit = active?.c === s.c
            return (
              <line
                key={s.name}
                x1={s.x}
                y1={s.y}
                x2={next.x}
                y2={next.y}
                stroke="currentColor"
                className={`transition-[opacity] duration-500 ${lit ? "text-foreground/60" : "text-foreground/15"}`}
                strokeWidth={1}
              />
            )
          })}
        </svg>

        {categories.map((cat, c) => (
          <p
            key={cat.title}
            className={`absolute font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-500 ${
              active?.c === c ? "text-foreground" : "text-muted"
            }`}
            style={{ left: `${(COLUMNS[c] / W) * 100}%`, top: 0 }}
          >
            {cat.title}
          </p>
        ))}

        <ul>
          {stars.map((s) => {
            const on = active?.name === s.name
            const dim = active && !on && active.c !== s.c
            return (
              <li
                key={s.name}
                className={`absolute -translate-y-1/2 ${on ? "z-20" : ""}`}
                style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
              >
                <button
                  type="button"
                  onPointerEnter={() => setActive(s)}
                  onFocus={() => setActive(s)}
                  className={`group -ml-[6px] flex items-center gap-3 py-1 pr-2 transition-opacity duration-500 ${
                    dim ? "opacity-30" : "opacity-100"
                  }`}
                >
                  <span className="flex size-3 items-center justify-center">
                    <span
                      className={`rounded-full bg-foreground transition-transform duration-300 ${
                        s.used ? "size-2.5 shadow-[0_0_14px_rgba(237,237,233,0.75)]" : "size-1.5 opacity-60"
                      } ${on ? "scale-150" : ""}`}
                    />
                  </span>
                  <span className={`text-[16px] whitespace-nowrap ${s.used ? "text-foreground" : "text-muted"}`}>
                    {s.name}
                  </span>
                </button>
                {on && (
                  <div
                    className={`pointer-events-none absolute top-1/2 z-10 w-[300px] -translate-y-1/2 border border-line bg-background p-4 ${
                      s.c === COLUMNS.length - 1 ? "right-full mr-5" : "left-full ml-3"
                    }`}
                  >
                    <Evidence skill={s} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function List() {
  return (
    <div className="flex flex-col gap-12">
      {categories.map((cat) => (
        <div key={cat.title} data-reveal>
          <p className="mb-4 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">{cat.title}</p>
          <ul className="border-t border-line">
            {cat.skills.map((s) => (
              <li key={s.name} className="border-b border-line py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full bg-foreground ${s.used ? "size-2 shadow-[0_0_10px_rgba(237,237,233,0.7)]" : "size-1.5 opacity-50"}`}
                  />
                  <span className={`text-[17px] ${s.used ? "text-foreground" : "text-muted"}`}>{s.name}</span>
                </div>
                {s.used && (
                  <div className="mt-2.5 pl-5">
                    <Evidence skill={s} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function Skills() {
  const ref = useSectionReveal<HTMLElement>()
  const desktop = useDesktop()

  return (
    <section id="skills" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-40 pb-32 md:px-10">
        <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
          03 — skills
        </p>
        <h2 data-reveal className="mb-20 font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]">
          Ferramentas do <span className="italic">dia a dia.</span>
        </h2>
        {desktop ? <Constellation /> : <List />}
      </div>
    </section>
  )
}
