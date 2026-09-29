import { useRef, useState } from "react"
import { useSectionReveal } from "@/hooks/useSectionReveal"
import CountUp from "@/components/ui/count-up"
import { Card } from "@/components/ui/card"
import { CourseDrawer, type DrawerTrack } from "@/components/CourseDrawer"
import { aluraTracks, parseDate, type Course } from "@/data/alura"
import { ibmTracks } from "@/data/ibm"
import { degrees } from "@/data/academic"

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

const fmt = (d: Date) => `${MONTHS[d.getMonth()]}/${d.getFullYear()}`

const time = (d: string) => parseDate(d).getTime()

const period = (courses: Course[]) => {
  const start = new Date(Math.min(...courses.map((c) => time(c.start))))
  const end = new Date(Math.max(...courses.map((c) => time(c.end))))
  return fmt(start) === fmt(end) ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
}

const startOf = (t: DrawerTrack) => Math.min(...t.courses.map((c) => time(c.start)))
const byStart = (a: Course, b: Course) => time(a.start) - time(b.start)
const dateLabel = (t: DrawerTrack) => fmt(new Date(startOf(t)))

const providers = [
  { id: "Alura", tracks: aluraTracks },
  { id: "IBM", tracks: ibmTracks },
].filter((p) => p.tracks.length > 0)

const allTracks: DrawerTrack[] = providers.flatMap((p) => p.tracks.map((t) => ({ ...t, provider: p.id })))

const ordered = [...allTracks].sort((a, b) => startOf(a) - startOf(b))

const totals = {
  hours: allTracks.reduce((sum, t) => sum + (t.hours ?? 0), 0),
  trails: allTracks.filter((t) => t.kind === "trilha").length,
  courses: allTracks.reduce((sum, t) => sum + t.courses.length, 0),
}

const stats = [
  { value: totals.hours, suffix: "h", label: "de curso" },
  { value: totals.trails, suffix: "", label: "trilhas completas" },
  { value: totals.courses, suffix: "", label: "cursos concluídos" },
].filter((s) => s.value > 0)

export function Education() {
  const ref = useSectionReveal<HTMLElement>()
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement | null>(null)

  return (
    <section id="formacao" ref={ref} className="border-t border-border">
      <div className="mx-auto flex min-h-[100svh] max-w-[1080px] flex-col justify-center px-6 pt-36 pb-24 md:pt-24">
        <div className="max-w-[640px]">
        <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
          04 / formação
        </p>
        <h2 data-reveal className="mb-3 text-[28px] font-bold sm:text-[34px]">
          Formação e cursos
        </h2>
        <p data-reveal className="mb-12 max-w-[560px] text-sm text-muted-foreground">
          Faculdade em andamento e mais de 500 horas de estudo focadas em Java, Spring Boot, mensageria, segurança e
          DevOps.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4">
          {degrees.map((d) => (
            <div key={d.course} data-reveal>
              <Card className="flex h-full flex-col justify-between p-6">
                <div className="mb-6 flex items-center justify-between gap-3 font-mono">
                  <span className="text-xs text-subtle">formação acadêmica</span>
                  <span className="rounded-[3px] border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {d.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-[18px] leading-snug font-bold">{d.course}</h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {d.institution} · {d.period}
                  </p>
                </div>
              </Card>
            </div>
          ))}

          <div data-reveal className="grid grid-cols-3 gap-4">
            {stats.map(({ value, suffix, label }) => (
              <Card key={label} className="flex flex-col justify-end p-4 sm:p-6">
                <div className="font-display text-[26px] leading-none font-bold text-foreground sm:text-[40px]">
                  <CountUp to={value} />
                  {suffix}
                </div>
                <div className="mt-2 font-mono text-[11px] text-subtle sm:text-xs">{label}</div>
              </Card>
            ))}
          </div>
        </div>

        <button
          data-reveal
          ref={opener}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="group inline-flex cursor-pointer items-center gap-2.5 rounded border border-border bg-surface/60 px-6 py-3.5 font-mono text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
        >
          ver todas as trilhas e cursos
          <span className="text-subtle transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:text-primary">
            →
          </span>
        </button>
        </div>
      </div>

      <CourseDrawer
        open={open}
        tracks={ordered}
        opener={opener}
        onClose={() => setOpen(false)}
        period={period}
        byStart={byStart}
        dateLabel={dateLabel}
      />
    </section>
  )
}
