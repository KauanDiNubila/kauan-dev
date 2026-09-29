import { useRef } from "react"
import { useSectionReveal } from "@/hooks/useSectionReveal"
import { gsap, useGSAP } from "@/lib/gsap"

type Project = {
  index: string
  tag: string
  name: string
  repo: string
  live: string
  desc: string
  features: string[]
  tech: string[]
}

const projects: Project[] = [
  {
    index: "01",
    tag: "em produção",
    name: "Astra",
    repo: "https://github.com/KauanDiNubila/astra",
    live: "https://astra-app.dev",
    desc: "Ecossistema de estudos e produtividade full-stack: sessões de foco viram a única fonte de dados da qual progresso, metas, streaks, heatmaps e ranking são derivados — nada fica pré-calculado. Tem camada social em tempo real (amigos, chat cifrado) e integração com o GitHub, conectando a atividade real de desenvolvimento ao tempo estudado.",
    features: [
      "Autenticação com JWT de curta duração e refresh token opaco que roda a cada uso, invalidando a sessão inteira se um token já utilizado for reaproveitado. Login tradicional com senha em BCrypt e recusa de senha já vazada (Have I Been Pwned), além de OAuth2 com Google e GitHub.",
      "Segurança pensada como parte da arquitetura, não uma camada adicional: autorização por dono auditada manualmente + scan automatizado OWASP ZAP sem nenhuma falha encontrada, CSP restritiva",
      "Integração real com GitHub: sincroniza commits, PRs e issues via OAuth2, conectando a atividade de desenvolvimento ao progresso de estudo",
      "Infra de produção separada por peça: frontend na Vercel, backend em VM Oracle Cloud (Docker Compose + Caddy), Postgres gerenciado (Neon), Cloudflare na borda — CI no GitHub Actions e testes com Testcontainers (Postgres real)",
    ],
    tech: ["Java 21", "Spring Boot", "PostgreSQL", "React"],
  },
  {
    index: "02",
    tag: "microsserviços",
    name: "Lexo",
    repo: "https://github.com/KauanDiNubila/lexo-backend",
    live: "https://lexo-kauan1.duckdns.org",
    desc: "SaaS multi-tenant para escritórios de advocacia, em 9 microsserviços independentes, cada um com banco próprio. Construído para explorar os desafios reais de sistemas distribuídos: comunicação entre serviços, consistência, processamento assíncrono e isolamento de dados.",
    features: [
      "Segurança distribuída no gateway: valida o JWT e propaga a identidade do usuário via headers assinados com HMAC, rejeitados se forjados ou reenviados fora da janela de validade. Cada serviço filtra toda query pelo tenant, isolando os dados entre organizações.",
      "Comunicação híbrida: OpenFeign para respostas síncronas imediatas. Kafka carrega eventos de domínio publicados por cliente-service e processo-service e consumidos pelo auditoria-service; RabbitMQ processa e-mails enfileirados por auth-service e processo-service, consumidos pelo notificacao-service, com retry e Dead Letter Queue.",
      "Resiliência com circuit breaker (Resilience4j), cache e rate limiting via Redis (chave por tenant) e tracing distribuído ponta a ponta com Micrometer e Zipkin.",
      "Lexo IA: resumo de processo, assistente jurídico e rascunho de petição via Google Gemini, com fallback heurístico que roda sem chave e custo zero.",
      "Portal do cliente por link mágico, sem login, com prazos e financeiro em tempo real.",
    ],
    tech: ["Java 21", "Spring Boot", "Spring Cloud", "Kafka"],
  },
]

const NAV_HEIGHT = 70
export const PROJECTS_PIN_SCALE = 2.4
export const PROJECTS_DWELL_BEFORE = 0.24
export const PROJECTS_MORPH_END = 0.58

function ProjectPanel({ project }: { project: Project }) {
  return (
    <div data-project-panel id={`projeto-${project.name.toLowerCase()}`} className="flex w-full items-center py-16">
      <div data-panel-inner className="mx-auto w-full max-w-[1080px] px-6">
        <div className="max-w-[600px]">
          <div className="mb-4 flex items-center gap-2.5 font-mono">
            <span className="text-xs text-subtle">{project.index}</span>
            <span className="rounded-[3px] border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
              {project.tag}
            </span>
          </div>
          <h3 className="mb-5 text-[40px] leading-[1.05] font-bold sm:text-[56px]">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-primary"
            >
              {project.name}
            </a>
          </h3>
          <p className="mb-6 max-w-[540px] text-[15px] leading-relaxed text-muted-foreground">{project.desc}</p>
          <div className="mb-6 flex flex-col gap-2.5">
            {project.features.map((f) => (
              <div key={f} className="flex gap-2.5 text-[13px] text-muted-foreground">
                <span className="shrink-0 text-primary">›</span>
                {f}
              </div>
            ))}
          </div>
          <div className="mb-9 flex flex-wrap gap-2 font-mono">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-[3px] border border-border bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5 font-mono">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-primary px-[22px] py-3 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
            >
              ver online ↗
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-border bg-surface/60 px-[22px] py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              código ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const intro = useSectionReveal<HTMLDivElement>()
  const pinRoot = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = pinRoot.current
      if (!root) return
      const panels = gsap.utils.toArray<HTMLElement>("[data-project-panel]", root)
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (panels.length < 2) return
        gsap.set(root, { position: "relative", height: `calc(100svh - ${NAV_HEIGHT}px)`, overflow: "hidden" })
        gsap.set(panels, { position: "absolute", inset: 0, paddingTop: 0, paddingBottom: 0, transformOrigin: "left center" })
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 28, scale: 0.97 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: `top ${NAV_HEIGHT}px`,
            end: () => "+=" + (panels.length - 1) * window.innerHeight * PROJECTS_PIN_SCALE,
            scrub: 0.35,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        const exitDur = 0.12
        const gap = 0.1
        const enterDur = PROJECTS_MORPH_END - PROJECTS_DWELL_BEFORE - exitDur - gap
        panels.forEach((panel, i) => {
          if (i === 0) return
          const base = i - 1
          const exitStart = base + PROJECTS_DWELL_BEFORE
          const enterStart = exitStart + exitDur + gap
          tl.to(
            panels[i - 1],
            { autoAlpha: 0, y: -28, scale: 0.97, duration: exitDur, ease: "power2.in" },
            exitStart
          ).fromTo(
            panel,
            { autoAlpha: 0, y: 28, scale: 0.97 },
            { autoAlpha: 1, y: 0, scale: 1, duration: enterDur, ease: "power2.out" },
            enterStart
          )
        })
        tl.set({}, {}, panels.length - 1)
      })

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        panels.forEach((panel) => {
          gsap.from(panel.querySelector("[data-panel-inner]"), {
            autoAlpha: 0,
            y: 32,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          })
        })
      })
    },
    { scope: pinRoot }
  )

  return (
    <section id="projetos" className="border-t border-border">
      <div ref={intro} className="mx-auto max-w-[1080px] px-6 pt-24">
        <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
          02 / projetos
        </p>
        <h2 data-reveal className="mb-3 text-[28px] font-bold sm:text-[34px]">
          Do código ao deploy
        </h2>
        <p data-reveal className="mb-4 max-w-[560px] text-sm text-muted-foreground">
          Projetos reais, desenvolvidos do zero e colocados em produção, aplicando na prática os conhecimentos que
          venho construindo.
        </p>
      </div>

      <div ref={pinRoot} id="projetos-pin">
        {projects.map((p) => (
          <ProjectPanel key={p.name} project={p} />
        ))}
      </div>
    </section>
  )
}
