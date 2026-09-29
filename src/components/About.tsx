import { useSectionReveal } from "@/hooks/useSectionReveal"

export function About() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="sobre" ref={ref} className="border-t border-border">
      <div className="mx-auto flex min-h-[85svh] max-w-[1080px] flex-col justify-center px-6 pt-36 pb-24 md:pt-24">
        <div className="md:ml-auto md:max-w-[520px]">
          <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
            01 / sobre mim
          </p>
          <h2 data-reveal className="mb-6 max-w-[480px] text-[28px] leading-tight font-bold sm:text-[40px]">
            Back-end é onde eu penso melhor.
          </h2>
          <p data-reveal className="text-[15px] leading-relaxed text-muted-foreground">
            Sou desenvolvedor Back-End focado em <strong className="text-foreground">Java</strong> e{" "}
            <strong className="text-foreground">Spring Boot</strong>, com interesse em arquitetura de software e
            desenvolvimento de sistemas. Atualmente curso Análise e Desenvolvimento de Sistemas e trabalho
            continuamente em projetos próprios.
          </p>
        </div>
      </div>
    </section>
  )
}
