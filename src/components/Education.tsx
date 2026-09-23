import { useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import CountUp from "@/components/ui/count-up"
import { Card } from "@/components/ui/card"
import { aluraTracks, parseDate, type Course, type Track } from "@/data/alura"
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

const startOf = (t: Track) => Math.min(...t.courses.map((c) => time(c.start)))
const byStart = (a: Course, b: Course) => time(a.start) - time(b.start)

type Tagged = Track & { provider: string }

const providers = [
  { id: "Alura", tracks: aluraTracks },
  { id: "IBM", tracks: ibmTracks },
].filter((p) => p.tracks.length > 0)

const allTracks: Tagged[] = providers.flatMap((p) => p.tracks.map((t) => ({ ...t, provider: p.id })))

const summarize = (tracks: Tagged[]) => ({
  hours: tracks.reduce((sum, t) => sum + (t.hours ?? 0), 0),
  trails: tracks.filter((t) => t.kind === "trilha").length,
  courses: tracks.reduce((sum, t) => sum + t.courses.length, 0),
})

function TrackCard({ track, index, showProvider }: { track: Tagged; index?: number; showProvider: boolean }) {
  const [open, setOpen] = useState(false)
  const expandable = !(track.courses.length === 1 && track.courses[0].name === track.name)
  const panelId = `panel-${track.provider}-${track.kind}-${track.name.replace(/\W+/g, "-")}`

  return (
    <Card>
      <button
        type="button"
        aria-expanded={expandable ? open : undefined}
        aria-controls={expandable ? panelId : undefined}
        disabled={!expandable}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full flex-col gap-3 p-5 text-left ${expandable ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 text-xs text-[#8B8B85]">
              {index !== undefined && <span>{String(index + 1).padStart(2, "0")}</span>}
              {showProvider && <span className="font-semibold text-foreground/70">{track.provider}</span>}
              <span>{period(track.courses)}</span>
            </div>
            <h3 className="text-[15px] leading-snug font-bold">{track.name}</h3>
          </div>
          <div className="shrink-0 text-right">
            {track.hours !== undefined && <div className="text-lg font-bold text-primary">{track.hours}h</div>}
            <div className="text-[11px] text-[#8B8B85]">
              {track.courses.length} {track.courses.length === 1 ? "curso" : "cursos"}
            </div>
          </div>
        </div>
        {expandable && <span className="text-[11px] text-[#8B8B85]">{open ? "ocultar −" : "ver cursos +"}</span>}
      </button>
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul
            className={`flex flex-col gap-2.5 border-t border-border px-5 py-4 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            {[...track.courses].sort(byStart).map((course) => (
              <li key={course.name} className="flex items-start justify-between gap-4 text-[13px]">
                <div className="min-w-0">
                  <div className="text-[#4B4B47]">
                    <span className="mr-2 text-primary">›</span>
                    {course.name}
                  </div>
                  <div className="ml-4 text-[11px] text-[#8B8B85]">{period([course])}</div>
                </div>
                {course.hours !== undefined && <span className="shrink-0 text-xs text-[#8B8B85]">{course.hours}h</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

export function Education() {
  const { ref, revealed } = useReveal<HTMLDivElement>()
  const [tab, setTab] = useState("todos")

  const tabs = [
    { id: "todos", label: "Todos", tracks: allTracks },
    ...providers.map((p) => ({ id: p.id, label: p.id, tracks: allTracks.filter((t) => t.provider === p.id) })),
  ]
  const current = tabs.find((t) => t.id === tab) ?? tabs[0]
  const stats = summarize(current.tracks)
  const trails = current.tracks.filter((t) => t.kind === "trilha").sort((a, b) => startOf(a) - startOf(b))
  const standalone = current.tracks.filter((t) => t.kind === "avulso").sort((a, b) => startOf(a) - startOf(b))
  const statCards = [
    { value: stats.hours, suffix: "h", label: "de curso" },
    { value: stats.trails, suffix: "", label: "trilhas completas" },
    { value: stats.courses, suffix: "", label: stats.courses === 1 ? "curso concluído" : "cursos concluídos" },
  ].filter((c) => c.value > 0)
  const showProvider = current.id === "todos" && providers.length > 1

  return (
    <div id="formacao" className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-16">
        <div ref={ref} className={`reveal ${revealed ? "revealed" : ""}`}>
          <p className="mb-2.5 text-[13px] font-semibold text-primary">04 / formação</p>
          <h2 className="mb-3 text-[28px] font-bold">Formação e cursos</h2>
          <p className="mb-9 max-w-[560px] text-sm text-[#5A5A54]">
            Faculdade em andamento e quase 500 horas de estudo focadas em Java, Spring Boot, mensageria, segurança e
            DevOps.
          </p>

          {degrees.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-4 text-[13px] font-semibold text-[#8B8B85]">formação acadêmica</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {degrees.map((d) => (
                  <Card key={d.course} className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#8B8B85]">{d.period}</span>
                      <span className="rounded-[3px] border border-primary/30 bg-primary/[0.08] px-2 py-0.5 text-[11px] text-primary">
                        {d.status}
                      </span>
                    </div>
                    <h4 className="text-[17px] font-bold">{d.course}</h4>
                    <p className="mt-1 text-[13px] text-[#5A5A54]">{d.institution}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[13px] font-semibold text-[#8B8B85]">cursos e certificações</h3>
            {providers.length > 1 && (
              <div role="tablist" aria-label="Instituição" className="flex gap-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={current.id === t.id}
                    onClick={() => setTab(t.id)}
                    className={`cursor-pointer rounded-[3px] border px-3 py-1 text-xs transition-colors ${
                      current.id === t.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-[#5A5A54] hover:border-primary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8 grid grid-cols-3 gap-4">
            {statCards.map(({ value, suffix, label }) => (
              <Card key={label} className="p-4 sm:p-5">
                <div className="text-2xl font-bold text-foreground sm:text-[32px]">
                  <CountUp key={`${current.id}-${value}`} to={value} />
                  {suffix}
                </div>
                <div className="mt-1 text-xs text-[#8B8B85]">{label}</div>
              </Card>
            ))}
          </div>

          <div key={current.id} className="[animation:heroFadeUp_.35s_ease_both] motion-reduce:animate-none">
            {trails.length > 0 && (
              <>
                <h3 className="mb-4 text-[13px] font-semibold text-[#8B8B85]">trilhas, em ordem cronológica</h3>
                <div className="mb-10 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  {trails.map((t, i) => (
                    <TrackCard key={`${t.provider}-${t.name}`} track={t} index={i} showProvider={showProvider} />
                  ))}
                </div>
              </>
            )}

            {standalone.length > 0 && (
              <>
                <h3 className="mb-4 text-[13px] font-semibold text-[#8B8B85]">cursos avulsos</h3>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  {standalone.map((t) => (
                    <TrackCard key={`${t.provider}-${t.name}`} track={t} showProvider={showProvider} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
