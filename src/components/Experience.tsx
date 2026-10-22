import { experiences } from "@/data/experience"
import { useSectionReveal } from "@/hooks/useSectionReveal"

export function Experience() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="experiencia" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-28 pb-16 md:px-10 md:pt-40 md:pb-20">
        <h2 data-reveal className="mb-12 font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em] md:mb-16">
          Experiência <span className="italic">profissional.</span>
        </h2>

        <ol className="border-t border-line">
          {experiences.map((e) => (
            <li
              key={e.company}
              data-reveal
              className="grid gap-8 border-b border-line py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16"
            >
              <div>
                <p className="mb-3 font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
                  {e.period}
                </p>
                <p className="font-serif text-[clamp(36px,4.4vw,60px)] leading-[1]">{e.company}</p>
                <p className="mt-3 text-[17px] text-foreground/90">{e.role}</p>
              </div>
              <div>
                <p className="text-[17px] leading-[1.65] text-foreground/90">{e.summary}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-[1.6] text-foreground/85">
                      <span aria-hidden className="mt-[9px] size-1 shrink-0 rounded-full bg-foreground/60" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
