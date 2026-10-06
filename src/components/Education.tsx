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
const endOf = (t: Entry) => Math.max(...t.courses.map((c) => time(c.end)))
const period = (t: Entry) => (fmt(startOf(t)) === fmt(endOf(t)) ? fmt(startOf(t)) : `${fmt(startOf(t))} – ${fmt(endOf(t))}`)
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

function Courses({ entry }: { entry: Entry }) {
  const courses = [...entry.courses].sort(byStart)
  return (
    <div className="px-6 pt-20 pb-16 md:px-10 md:pt-24">
      <p data-sheet-item className="mb-4 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
        {entry.provider}
        {entry.kind === "trilha" && " · trilha"} · {period(entry)}
      </p>
      <h3 data-sheet-item className="font-serif text-[40px] leading-[1.02]">
        {entry.name}
      </h3>
      <p data-sheet-item className="mt-4 text-[16px] text-muted">
        {entry.hours !== undefined && `${entry.hours}h · `}
        {courses.length} {courses.length === 1 ? "curso" : "cursos"}
      </p>
      <ol className="mt-10 border-t border-line">
        {courses.map((c, i) => (
          <li key={c.name} data-sheet-item className="grid grid-cols-[32px_1fr_auto] gap-3 border-b border-line py-5">
            <span className="pt-0.5 font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="text-[16px] leading-snug text-foreground">{c.name}</p>
              <p className="mt-1.5 font-mono text-[12px] text-muted">
                {day(c.start)}
                {c.end !== c.start && ` → ${day(c.end)}`}
              </p>
            </div>
            {c.hours !== undefined && <span className="pt-0.5 font-mono text-[13px] text-muted">{c.hours}h</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Education() {
  const ref = useSectionReveal<HTMLElement>()
  const log = useRef<HTMLDivElement>(null)
  const counters = useRef<HTMLDListElement>(null)
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState<Entry>(entries[0])
  const opener = useRef<HTMLButtonElement | null>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      "[data-log-line]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: log.current, start: "top 75%", end: "bottom 60%", scrub: true },
      }
    )
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
  }, { scope: ref })

  const show = (e: Entry, el: HTMLButtonElement) => {
    opener.current = el
    setShown(e)
    setOpen(true)
  }

  return (
    <section id="formacao" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-40 pb-32 md:px-10">
        <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
          04 — formação
        </p>
        <div className="mb-20 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end">
          <h2 data-reveal className="font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]">
            Formação e <span className="italic">cursos.</span>
          </h2>
          <p data-reveal className="max-w-[460px] text-[17px] leading-[1.65] text-foreground/85">
            Faculdade em andamento e mais de 500 horas de estudo focadas em Java, Spring Boot, mensageria, segurança e
            DevOps.
          </p>
        </div>

        <div className="grid gap-12 border-y border-line py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {degrees.map((d) => (
            <div key={d.course} data-reveal>
              <p className="mb-3 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
                Graduação · {d.status}
              </p>
              <p className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.02]">{d.course}</p>
              <p className="mt-3 text-[16px] text-muted">
                {d.institution} · {d.period}
              </p>
            </div>
          ))}
          <dl ref={counters} data-reveal className="grid grid-cols-3 gap-6 self-end">
            {totals.map((t) => (
              <div key={t.label}>
                <dt className="font-serif text-[clamp(44px,5vw,72px)] leading-none">
                  <span data-count={t.value}>{t.value}</span>
                  {t.suffix}
                </dt>
                <dd className="mt-2 text-[14px] leading-snug text-muted">{t.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={log} className="relative mt-16">
          <span
            data-log-line
            aria-hidden
            className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-foreground/40 md:left-[167px]"
          />
          <ol>
            {entries.map((e) => (
              <li key={`${e.provider}-${e.name}`} data-reveal>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(ev) => show(e, ev.currentTarget)}
                  className="group grid w-full grid-cols-[12px_1fr] gap-x-6 py-5 text-left md:grid-cols-[136px_12px_1fr_auto] md:gap-x-6"
                >
                  <span className="col-start-2 font-mono text-[12px] tracking-[0.1em] text-muted uppercase md:col-start-1 md:pt-1.5 md:text-right">
                    {fmt(startOf(e))}
                  </span>
                  <span className="relative col-start-1 row-span-2 row-start-1 flex justify-center pt-2 md:col-start-2 md:row-span-1">
                    <span className="size-[11px] rounded-full border border-foreground/60 bg-background transition-colors duration-300 group-hover:bg-foreground" />
                  </span>
                  <span className="col-start-2 md:col-start-3">
                    <span className="block text-[19px] leading-snug text-foreground transition-transform duration-300 group-hover:translate-x-1">
                      {e.name}
                    </span>
                    <span className="mt-1.5 block text-[14px] text-muted">
                      {e.provider}
                      {e.kind === "trilha" && " · trilha"}
                      {e.hours !== undefined && ` · ${e.hours}h`} · {e.courses.length}{" "}
                      {e.courses.length === 1 ? "curso" : "cursos"}
                    </span>
                  </span>
                  <span className="hidden pt-1 font-mono text-[12px] tracking-[0.12em] text-muted uppercase transition-colors group-hover:text-foreground md:block">
                    ver cursos →
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} opener={opener} title={shown.name} variant="side">
        <Courses entry={shown} />
      </Sheet>
    </section>
  )
}
