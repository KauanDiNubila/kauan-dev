import { useSectionReveal } from "@/hooks/useSectionReveal"

export function Contact() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="contato" ref={ref} className="border-t border-border">
      <div className="mx-auto flex min-h-[70svh] max-w-[1080px] flex-col items-center justify-center px-6 py-24 text-center">
        <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
          05 / contato
        </p>
        <h2 data-reveal className="mb-3.5 text-[34px] font-bold sm:text-[44px]">
          Contato
        </h2>
        <p data-reveal className="mb-9 text-[15px] text-muted-foreground">
          Acompanhe meu trabalho e entre em contato pelas redes abaixo.
        </p>
        <div data-reveal className="flex flex-wrap justify-center gap-3.5">
          <a
            href="mailto:kauandinubila@gmail.com"
            className="inline-flex items-center gap-1.5 rounded bg-primary px-6 py-3.5 font-mono text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
          >
            E-mail
          </a>
          <a
            href="https://github.com/KauanDiNubila"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded bg-foreground px-6 py-3.5 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            GitHub <span>↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/kauan-di-nubila-933562263"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-border bg-surface/60 px-6 py-3.5 font-mono text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
          >
            LinkedIn <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
