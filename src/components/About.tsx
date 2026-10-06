import { useRef } from "react"
import { useSectionReveal } from "@/hooks/useSectionReveal"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap"

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
  const text = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create("[data-scrub]", { type: "words" })
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: text.current, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      )
      return () => split.revert()
    },
    { scope: text }
  )

  return (
    <section id="sobre" ref={ref} className="relative">
      <div className="mx-auto max-w-[1320px] px-5 pt-40 pb-32 md:px-10">
        <p data-reveal className="mb-10 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          01 — sobre
        </p>

        <div className="grid gap-16 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <h2
            data-reveal
            className="font-serif text-[clamp(44px,7vw,104px)] leading-[0.92] tracking-[-0.015em]"
          >
            Back-end é onde eu <span className="italic">penso melhor.</span>
          </h2>

          <dl data-reveal className="self-end border-t border-line">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[112px_1fr] gap-4 border-b border-line py-3.5">
                <dt className="pt-0.5 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{f.label}</dt>
                <dd className="text-[15px] text-foreground">{f.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[112px_1fr] gap-4 border-b border-line py-3.5">
              <dt className="pt-0.5 font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">Status</dt>
              <dd className="flex items-center gap-2.5 text-[15px] text-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-50 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-foreground" />
                </span>
                Buscando a primeira oportunidade
              </dd>
            </div>
          </dl>
        </div>

        <div ref={text} className="mt-28 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <p data-scrub className="text-[clamp(20px,2.1vw,28px)] leading-[1.35] text-foreground">
            {paragraphs[0]}
          </p>
          <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-muted md:pt-2">
            {paragraphs.slice(1).map((p) => (
              <p key={p} data-scrub>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
