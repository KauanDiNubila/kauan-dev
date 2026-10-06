import { useRef } from "react"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap"

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create("[data-hero-name]", { type: "lines,chars", mask: "lines" })
      gsap
        .timeline({ defaults: { ease: "power4.out" }, delay: 0.5 })
        .from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.03 })
        .from("[data-hero-fade]", { autoAlpha: 0, y: 14, duration: 1, stagger: 0.12 }, "-=0.9")
    },
    { scope: root }
  )

  return (
    <section id="top" ref={root} className="relative h-svh min-h-[620px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(7,7,7,0.85),transparent_60%)]" />

      <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <p data-hero-fade className="mb-5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Desenvolvedor back-end
        </p>

        <h1
          data-hero-name
          className="font-serif text-[clamp(84px,13vw,200px)] leading-[0.86] tracking-[-0.02em] text-foreground"
        >
          Kauan
          <br />
          <span className="italic">Di Nubila</span>
        </h1>

        <div className="mt-10 flex flex-col gap-6 border-t border-line pt-5 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-[340px] text-[15px] leading-relaxed text-muted">
            Foco em Java, arquitetura de software e sistemas bem construídos.
          </p>
          <div data-hero-fade className="flex items-center gap-8 font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">
            <span>java · spring boot · microsserviços</span>
            <a href="#sobre" className="text-muted transition-colors hover:text-foreground">
              role ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
