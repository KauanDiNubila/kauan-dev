import { useSectionReveal } from "@/hooks/useSectionReveal"

export function About() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="sobre" ref={ref} className="border-t border-border">
      <div className="mx-auto flex min-h-[85svh] max-w-[1080px] flex-col justify-center px-6 py-24">
        <div className="md:ml-auto md:max-w-[520px]">
          <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
            01 / sobre mim
          </p>
          <h2 data-reveal className="mb-6 max-w-[480px] text-[28px] leading-tight font-bold sm:text-[40px]">
            Back-end é onde eu penso melhor.
          </h2>
          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground">
            <p data-reveal>
              Sou estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor Back-end com foco em Java e
              Spring Boot. Tenho construído aplicações completas, desde a modelagem e desenvolvimento das APIs até
              testes, segurança, infraestrutura e deploy em produção.
            </p>
            <p data-reveal>
              Meu foco está no desenvolvimento de sistemas bem estruturados, com atenção a arquitetura, segurança,
              integração entre serviços e qualidade de código. Nos meus projetos, tenho explorado tanto
              arquiteturas modulares quanto microserviços, além de tecnologias como mensageria, comunicação em
              tempo real e cloud.
            </p>
            <p data-reveal>
              Atualmente, busco minha primeira oportunidade profissional na área, onde possa aplicar o que venho
              construindo na prática, aprender com um time experiente e evoluir junto com projetos reais.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
