import { useDesktop } from "@/hooks/useDesktop"
import { useSectionReveal } from "@/hooks/useSectionReveal"

const paragraphs = [
  "Tenho 20 anos e comecei a estudar programação em 2025. Depois, entrei na faculdade de Análise e Desenvolvimento de Sistemas, onde estou hoje no 3º semestre. Fui parar no back-end porque me interessei pela arquitetura por trás de um sistema, pela complexidade das decisões e pelo leque de tecnologias e padrões que existem para montar cada um.",
  "Aprendi muito por conta própria, com mais de 500 horas de cursos na Alura, e principalmente construindo projetos. O Astra começou como uma ferramenta para organizar meus próprios estudos, e hoje está publicado na Microsoft Store.",
  "Agora, busco minha primeira oportunidade profissional em desenvolvimento back-end, onde possa contribuir com o conhecimento que construí na prática, trocar experiências com desenvolvedores mais experientes e continuar evoluindo ao trabalhar em equipe e desenvolver soluções utilizadas no dia a dia.",
]

const facts = ["ADS · Estácio (2025–2027)", "Java e Spring Boot", "Inglês avançado"]

export function About() {
  const ref = useSectionReveal<HTMLElement>()
  const desktop = useDesktop()

  return (
    <section id="sobre" ref={ref} className="relative">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 pt-28 pb-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-10 md:pt-40 md:pb-32">
        <div>
          {desktop ? (
            <div data-portrait aria-hidden className="mx-auto aspect-[720/760] h-[62vh] max-w-full" />
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
            Sobre <span className="italic">mim.</span>
          </h2>

          <div className="mt-10 flex max-w-[640px] flex-col gap-6 text-[18px] leading-[1.7] text-foreground/90">
            {paragraphs.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <div data-reveal className="mt-10 max-w-[640px] border-t border-line pt-6">
            <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] tracking-[0.12em] text-muted uppercase">
              {facts.map((f, i) => (
                <span key={f} className="flex gap-3">
                  {i > 0 && <span aria-hidden>·</span>}
                  {f}
                </span>
              ))}
            </p>
            <p className="mt-4 flex items-center gap-2.5 text-[16px] text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-foreground" />
              </span>
              Buscando a primeira oportunidade
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
