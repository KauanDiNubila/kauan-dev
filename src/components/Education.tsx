import { useRef, useState } from "react"
import { Sheet } from "@/components/Sheet"
import { degrees } from "@/data/academic"
import { aluraTracks, parseDate, type Course, type Track } from "@/data/alura"
import { ibmTracks } from "@/data/ibm"
import { useSectionReveal } from "@/hooks/useSectionReveal"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap"

type Entry = Track & { provider: string }

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
const time = (d: string) => parseDate(d).getTime()
const fmt = (t: number) => {
  const d = new Date(t)
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
const startOf = (t: Entry) => Math.min(...t.courses.map((c) => time(c.start)))
const byStart = (a: Course, b: Course) => time(a.start) - time(b.start)
const day = (d: string) => {
  const x = parseDate(d)
  return `${String(x.getDate()).padStart(2, "0")} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`
}

const entries: Entry[] = [
  ...aluraTracks.map((t) => ({ ...t, provider: "Alura" })),
  ...ibmTracks.map((t) => ({ ...t, provider: "IBM" })),
].sort((a, b) => startOf(a) - startOf(b))

const totals = [
  { value: entries.reduce((s, t) => s + (t.hours ?? 0), 0), suffix: "h", label: "de estudo" },
  { value: entries.filter((t) => t.kind === "trilha").length, suffix: "", label: "trilhas completas" },
  { value: entries.reduce((s, t) => s + t.courses.length, 0), suffix: "", label: "cursos concluídos" },
]

function Milestone({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false)
  const courses = [...entry.courses].sort(byStart)
  const single = courses.length === 1 && courses[0].name === entry.name
  const panelId = `cursos-${entry.provider}-${entry.name.replace(/\W+/g, "-")}`

  return (
    <li data-sheet-item className="relative pb-8 pl-8 last:pb-1">
      <span aria-hidden className="absolute top-[7px] left-0 size-[11px] rounded-full border border-foreground/60 bg-background" />
      <button
        type="button"
        aria-expanded={single ? undefined : open}
        aria-controls={single ? undefined : panelId}
        disabled={single}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full flex-col gap-1.5 text-left ${single ? "cursor-default" : "group"}`}
      >
        <span className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">
          {fmt(startOf(entry))} · {entry.provider}
          {entry.kind === "trilha" && " · trilha"}
        </span>
        <span className="flex items-start justify-between gap-4">
          <span className="text-[17px] leading-snug text-foreground transition-opacity group-hover:opacity-80">
            {entry.name}
          </span>
          <span className="shrink-0 text-right font-mono">
            {entry.hours !== undefined && <span className="block text-[15px] text-foreground">{entry.hours}h</span>}
            <span className="block text-[12px] text-muted">
              {courses.length} {courses.length === 1 ? "curso" : "cursos"}
              {!single && <span className="ml-1.5">{open ? "−" : "+"}</span>}
            </span>
          </span>
        </span>
      </button>
      {!single && (
        <div
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ol className="flex flex-col gap-3 pt-4">
              {courses.map((c, i) => (
                <li key={c.name} className="grid grid-cols-[24px_1fr_auto] gap-3">
                  <span className="pt-0.5 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[15px] leading-snug text-foreground/90">{c.name}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-muted">
                      {day(c.start)}
                      {c.end !== c.start && ` → ${day(c.end)}`}
                    </span>
                  </span>
                  {c.hours !== undefined && <span className="pt-0.5 font-mono text-[12px] text-muted">{c.hours}h</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </li>
  )
}

export function Education() {
  const ref = useSectionReveal<HTMLElement>()
  const counters = useRef<HTMLDListElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: to,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
          scrollTrigger: { trigger: counters.current, start: "top 85%", once: true },
        })
      })
    },
    { scope: ref }
  )

  return (
    <section id="formacao" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-28 pb-16 md:px-10 md:pt-40 md:pb-32">
        <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
          04 — formação
        </p>
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end">
          <h2 data-reveal className="font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]">
            Formação e <span className="italic">cursos.</span>
          </h2>
          <p data-reveal className="max-w-[460px] text-[17px] leading-[1.65] text-foreground/85">
            Faculdade em andamento e, por fora, mais de 500 horas de cursos focados em Java, Spring Boot,
            mensageria, segurança e DevOps.
          </p>
        </div>

        <div className="grid gap-12 border-y border-line py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {degrees.map((d) => (
            <div key={d.course} data-reveal>
              <p className="mb-3 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Graduação · {d.status}</p>
              <p className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.02]">{d.course}</p>
              <p className="mt-3 text-[16px] text-muted">
                {d.institution} · {d.period}
              </p>
            </div>
          ))}
          <div data-reveal className="border-t border-line pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-12">
            <p className="mb-6 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Cursos · Alura e IBM</p>
            <dl ref={counters} className="grid grid-cols-3 gap-6">
              {totals.map((t) => (
                <div key={t.label}>
                  <dt className="font-serif text-[clamp(40px,4.4vw,64px)] leading-none">
                    <span data-count={t.value}>{t.value}</span>
                    {t.suffix}
                  </dt>
                  <dd className="mt-2 text-[14px] leading-snug text-muted">{t.label}</dd>
                </div>
              ))}
            </dl>
            <button
              ref={opener}
              type="button"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              Ver todas as trilhas e cursos
              <span className="text-muted transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-foreground">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        opener={opener}
        title="Trilhas e cursos"
        description={`${entries.length} marcos, em ordem cronológica`}
        variant="side"
      >
        <div className="px-6 pt-20 pb-16 md:px-10 md:pt-24">
          <h3 data-sheet-item className="font-serif text-[40px] leading-none">
            Trilhas e cursos
          </h3>
          <p data-sheet-item className="mt-3 font-mono text-[12px] tracking-[0.12em] text-muted uppercase">
            {entries.length} marcos, em ordem cronológica
          </p>
          <div className="relative mt-10">
            <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
            <ol className="relative">
              {entries.map((e) => (
                <Milestone key={`${e.provider}-${e.name}`} entry={e} />
              ))}
            </ol>
          </div>
        </div>
      </Sheet>
    </section>
  )
}
