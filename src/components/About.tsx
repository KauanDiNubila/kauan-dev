import { useSectionReveal } from "@/hooks/useSectionReveal"

const facts = [
  { label: "Nome", value: "Kauan Di Nubila" },
  { label: "Idade", value: "20 anos" },
  { label: "Formação", value: "Análise e Desenvolvimento de Sistemas" },
  { label: "Foco", value: "Back-end com Java e Spring Boot" },
  { label: "Explorando", value: "Microsserviços, mensageria, tempo real e cloud" },
]

const paragraphs = [
  "Meu nome é Kauan Di Nubila, tenho 20 anos e sou estudante de Análise e Desenvolvimento de Sistemas, com foco em desenvolvimento Back-end com Java e Spring Boot. Tenho construído aplicações completas, desde a modelagem e desenvolvimento das APIs até testes, segurança, infraestrutura e deploy em produção.",
  "Meu foco está no desenvolvimento de sistemas bem estruturados, com atenção a arquitetura, segurança, integração entre serviços e qualidade de código. Nos meus projetos, tenho explorado tanto arquiteturas modulares quanto microserviços, além de tecnologias como mensageria, comunicação em tempo real e cloud.",
  "Atualmente, busco minha primeira oportunidade profissional na área, onde possa aplicar o que venho construindo na prática, aprender com um time experiente e evoluir junto com projetos reais.",
]

export function About() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="sobre" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-40 pb-32 md:px-10">
        <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
          01 — sobre
        </p>

        <h2 data-reveal className="max-w-[900px] font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]">
          Back-end é onde eu <span className="italic">penso melhor.</span>
        </h2>

        <div className="mt-20 grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20">
          <dl data-reveal className="self-start">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-line py-4">
                <dt className="mb-1 font-mono text-[12px] tracking-[0.12em] text-muted uppercase">{f.label}</dt>
                <dd className="text-[17px] text-foreground">{f.value}</dd>
              </div>
            ))}
            <div className="border-y border-line py-4">
              <dt className="mb-1 font-mono text-[12px] tracking-[0.12em] text-muted uppercase">Status</dt>
              <dd className="flex items-center gap-2.5 text-[17px] text-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-50 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-foreground" />
                </span>
                Buscando a primeira oportunidade
              </dd>
            </div>
          </dl>

          <div className="flex max-w-[620px] flex-col gap-6 text-[18px] leading-[1.7] text-foreground/90">
            {paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
