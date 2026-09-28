import { useRef } from "react"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap"

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create("[data-hero-name]", { type: "words,chars", mask: "chars" })
      gsap
        .timeline({ defaults: { ease: "power4.out" }, delay: 0.15 })
        .from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.035 })
        .fromTo(
          "[data-hero-role]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "steps(24)" },
          "-=0.55"
        )
        .from("[data-hero-fade]", { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.1 }, "-=0.2")
    },
    { scope: root }
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative mx-auto flex min-h-[calc(100svh-70px)] max-w-[1080px] flex-col justify-center px-6 py-24"
    >
      <h1
        data-hero-name
        className="mb-5 text-[44px] leading-[1.05] font-extrabold tracking-[-1.5px] sm:text-[72px]"
      >
        Kauan Di Nubila
      </h1>

      <div data-hero-role className="mb-6 inline-block self-start font-mono text-[20px] font-semibold whitespace-nowrap text-primary sm:text-[24px]">
        // Desenvolvedor Back-End
      </div>

      <p data-hero-fade className="mb-10 max-w-[520px] text-[16px] text-muted-foreground">
        Foco em Java, arquitetura de software e sistemas bem construídos.
      </p>

      <div data-hero-fade className="flex flex-wrap gap-3.5">
        <a
          href="#projetos"
          className="rounded bg-primary px-[22px] py-3 font-mono text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
        >
          ver projetos
        </a>
        <a
          href="#contato"
          className="rounded border border-border bg-surface/60 px-[22px] py-3 font-mono text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
        >
          falar comigo
        </a>
      </div>

      <span data-hero-fade className="absolute bottom-8 left-6 font-mono text-[11px] text-subtle">
        role para baixo ↓
      </span>
    </section>
  )
}
