import { useReveal } from "@/hooks/useReveal"

export function About() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div id="sobre" className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-16">
        <div ref={ref} className={`reveal ${revealed ? "revealed" : ""}`}>
          <p className="mb-2.5 text-[13px] font-semibold text-primary">01 / sobre mim</p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.4fr]">
            <h2 className="max-w-[320px] text-[28px] font-bold">
              Back-end é onde eu penso melhor.
            </h2>
            <div className="max-w-[560px] text-[15px] text-muted-foreground">
              <p>
                Sou desenvolvedor Back-End focado em{" "}
                <strong className="text-foreground">Java</strong> e{" "}
                <strong className="text-foreground">Spring Boot</strong>, com interesse em
                arquitetura de software e desenvolvimento de sistemas. Atualmente curso
                Análise e Desenvolvimento de Sistemas e trabalho continuamente em projetos
                próprios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
