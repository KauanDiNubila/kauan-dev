import { useDesktop } from "@/hooks/useDesktop"
import { useSectionReveal } from "@/hooks/useSectionReveal"

const facts = [
  { label: "Nome", value: "Kauan Di Nubila" },
  { label: "Idade", value: "20 anos" },
  { label: "Formação", value: "Análise e Desenvolvimento de Sistemas" },
  { label: "Foco", value: "Back-end com Java e Spring Boot" },
  { label: "Explorando", value: "Microsserviços, mensageria, tempo real e cloud" },
  { label: "Inglês", value: "Avançado" },
]

const paragraphs = [
  "Meu nome é Kauan Di Nubila, tenho 20 anos e sou estudante de Análise e Desenvolvimento de Sistemas, com foco em desenvolvimento Back-end com Java e Spring Boot. Tenho construído aplicações completas, desde a modelagem e desenvolvimento das APIs até testes, segurança, infraestrutura e deploy em produção.",
  "Meu foco está no desenvolvimento de sistemas bem estruturados, com atenção a arquitetura, segurança, integração entre serviços e qualidade de código. Nos meus projetos, tenho explorado tanto arquiteturas modulares quanto microserviços, além de tecnologias como mensageria, comunicação em tempo real e cloud.",
  "Atualmente, busco minha primeira oportunidade profissional na área, onde possa aplicar o que venho construindo na prática, aprender com um time experiente e evoluir junto com projetos reais.",
]

export function About() {
  const ref = useSectionReveal<HTMLElement>()
  const desktop = useDesktop()

  return (
    <section id="sobre" ref={ref} className="relative">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 pt-40 pb-32 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-10">
        <div className="md:order-none">
          {desktop ? (
            <div data-portrait aria-hidden className="sticky top-[18vh] mx-auto aspect-[720/760] h-[62vh] max-w-full" />
          ) : (
            <img
              src="/portrait-dither.png"
              alt="Retrato de Kauan Di Nubila em pontos"
              className="mx-auto w-[78%] max-w-[360px]"
            />
          )}
        </div>

        <div>
          <p data-reveal className="mb-10 font-mono text-[12px] tracking-[0.16em] text-muted uppercase">
            01 — sobre
          </p>
          <h2 data-reveal className="font-serif text-[clamp(44px,6vw,92px)] leading-[0.92] tracking-[-0.015em]">
            Back-end é onde eu <span className="italic">penso melhor.</span>
          </h2>

          <dl data-reveal className="mt-14 grid gap-x-10 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-line py-4">
                <dt className="mb-1 font-mono text-[12px] tracking-[0.12em] text-muted uppercase">{f.label}</dt>
                <dd className="text-[17px] text-foreground">{f.value}</dd>
              </div>
            ))}
            <div className="border-t border-line py-4 sm:col-span-2">
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

          <div className="mt-14 flex max-w-[640px] flex-col gap-6 text-[18px] leading-[1.7] text-foreground/90">
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
