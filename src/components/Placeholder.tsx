import { useSectionReveal } from "@/hooks/useSectionReveal"

export function Placeholder({ id, n, label, format }: { id: string; n: string; label: string; format: string }) {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id={id} ref={ref} className="border-t border-line">
      <div className="mx-auto flex min-h-[70svh] max-w-[1320px] flex-col justify-between px-5 py-16 md:px-10">
        <p data-reveal className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          {n} — {label}
        </p>
        <div>
          <h2 data-reveal className="font-serif text-[clamp(48px,8vw,120px)] leading-[0.9] italic">
            {label}
          </h2>
          <p data-reveal className="mt-4 font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">
            em construção — {format}
          </p>
        </div>
      </div>
    </section>
  )
}
