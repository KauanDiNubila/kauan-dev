import { useRef, useState } from "react"
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram"
import { Sheet } from "@/components/Sheet"
import { architectures } from "@/data/architecture"
import { projects, shots, type Project } from "@/data/projects"
import { useDesktop } from "@/hooks/useDesktop"
import { useSectionReveal } from "@/hooks/useSectionReveal"

function Case({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-[1100px] px-5 pt-24 pb-24 md:px-10 md:pt-28">
      <div data-sheet-item className="mb-6 flex items-center gap-4 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
        <span>{project.index}</span>
        <span className="h-px w-8 bg-line" />
        <span>{project.tag}</span>
      </div>
      <h3 data-sheet-item className="font-serif text-[clamp(64px,12vw,168px)] leading-[0.85] tracking-[-0.02em]">
        {project.name}
      </h3>
      <p data-sheet-item className="mt-6 max-w-[680px] text-[clamp(19px,2vw,24px)] leading-snug text-foreground/90">
        {project.desc}
      </p>

      <div data-sheet-item className="mt-10 flex flex-wrap gap-3">
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-foreground px-6 py-3 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
        >
          Ver online ↗
        </a>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          Código ↗
        </a>
        {project.store && (
          <a
            href={project.store}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            Microsoft Store ↗
          </a>
        )}
      </div>

      <ul data-sheet-item className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
        {project.tech.map((t) => (
          <li key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[14px] text-foreground/90">
            {t}
          </li>
        ))}
      </ul>

      <section data-sheet-item className="mt-14">
        <h4 className="mb-5 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Funcionalidades</h4>
        <ul className="grid gap-x-12 gap-y-3 xl:grid-cols-2">
          {project.capabilities.map((c) => (
            <li key={c.name} className="text-[16px] leading-snug">
              <span className="text-foreground">{c.name}</span>
              <span className="text-muted"> · {c.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {architectures[project.slug] && (
        <section data-sheet-item className="mt-16">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h4 className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Arquitetura</h4>
            <p className="text-[15px] text-muted">{architectures[project.slug].caption}</p>
          </div>
          <ArchitectureDiagram arch={architectures[project.slug]} />
        </section>
      )}

      <section data-sheet-item className="mt-16">
        <h4 className="mb-6 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Destaques</h4>
        <ol className="grid gap-x-10 border-t border-line md:grid-cols-3">
          {project.features.map((f, i) => (
            <li key={f} className="flex gap-3 border-b border-line py-5 md:border-b-0">
              <span className="pt-1 font-mono text-[12px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[16px] leading-[1.6] text-foreground/90">{f}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-sheet-item className="mt-14">
        <h4 className="mb-6 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Decisões</h4>
        <dl className={`grid gap-x-10 border-t border-line ${project.decisions.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {project.decisions.map((d) => (
            <div
              key={d.q}
              className={`border-b border-line py-6 ${
                project.decisions.length === 4 ? "md:[&:nth-last-child(-n+2)]:border-b-0" : "md:border-b-0"
              }`}
            >
              <dt className="font-serif text-[clamp(22px,2vw,27px)] leading-tight">{d.q}</dt>
              <dd className="mt-3 text-[15px] leading-[1.65] text-foreground/85">{d.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {shots(project).map((src, i) => (
          <img
            key={src}
            data-sheet-item
            src={src}
            alt={`${project.name}, tela ${i + 1}`}
            loading="lazy"
            className="w-full border border-line transition-[filter] duration-500 md:grayscale md:hover:grayscale-0"
          />
        ))}
      </div>
    </article>
  )
}

export function Projects() {
  const ref = useSectionReveal<HTMLElement>()
  const desktop = useDesktop()
  const [hover, setHover] = useState<Project | null>(null)
  const [open, setOpen] = useState<Project | null>(null)
  const [shown, setShown] = useState<Project>(projects[0])
  const opener = useRef<HTMLButtonElement | null>(null)

  const openCase = (p: Project, el: HTMLButtonElement) => {
    opener.current = el
    setShown(p)
    setOpen(p)
    setHover(null)
  }

  return (
    <section id="projetos" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-28 pb-16 md:px-10 md:pt-40 md:pb-32">
        <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
          02 — projetos
        </p>
        <div className="mb-12 grid gap-8 md:mb-20 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end">
          <h2 data-reveal className="font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]">
            Do código <span className="italic">ao deploy.</span>
          </h2>
          <p data-reveal className="max-w-[460px] text-[17px] leading-[1.65] text-foreground/85">
            Projetos reais, desenvolvidos do zero e colocados em produção, aplicando na prática os conhecimentos que
            venho construindo.
          </p>
        </div>

        <ul className="border-t border-line" onPointerLeave={() => setHover(null)}>
          {projects.map((p) => {
            const active = desktop && hover?.slug === p.slug
            return (
              <li key={p.slug} data-reveal className="border-b border-line">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onPointerEnter={() => desktop && setHover(p)}
                  onFocus={() => desktop && setHover(p)}
                  onClick={(e) => openCase(p, e.currentTarget)}
                  className="block w-full py-8 text-left md:py-10"
                >
                  <span className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 md:grid-cols-[64px_1fr_auto]">
                    <span className="font-mono text-[13px] text-muted">{p.index}</span>
                    <span
                      className={`font-serif text-[clamp(56px,10vw,150px)] leading-[0.9] tracking-[-0.02em] transition-[translate] duration-500 ${
                        active ? "translate-x-3 italic" : ""
                      }`}
                    >
                      {p.name}
                    </span>
                    <span className="col-span-2 mt-4 flex flex-col gap-2 md:col-span-1 md:mt-0 md:items-end md:text-right">
                      <span className="text-[17px] text-foreground/90">{p.summary}</span>
                      <span className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
                        {p.tag} · ver caso →
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Sheet
        open={open !== null}
        onClose={() => setOpen(null)}
        opener={opener}
        title={shown.name}
        description={shown.summary}
        variant="full"
      >
        <Case project={shown} />
      </Sheet>
    </section>
  )
}
