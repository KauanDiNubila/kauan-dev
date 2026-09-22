import { useReveal } from "@/hooks/useReveal"
import { ProjectCard, type Project } from "@/components/ProjectCard"

const projects: Project[] = [
  {
    index: "01",
    tag: "em produção",
    name: "Astra",
    repo: "https://github.com/KauanDiNubila/astra",
    url: "astra-app.dev",
    desc: "Ecossistema de estudos com sessões de foco (Pomodoro), dashboard, metas, roadmaps de aprendizado, chat em tempo real e integração real com GitHub — tudo agregado sobre uma única unidade de dados: a sessão.",
    features: [
      "Auth com JWT + refresh token, OAuth2 (Google/GitHub) e recusa de senha já vazada (Have I Been Pwned)",
      "Dashboard, heatmap e ranking calculados por agregação sobre as sessões — nada fica pré-calculado",
      "Integração com GitHub: sincroniza commits, PRs e issues e cruza com o tempo estudado",
      "Chat em tempo real via WebSocket/STOMP com mensagens cifradas (AES-256-GCM)",
    ],
    tech: ["Java 21", "Spring Boot", "PostgreSQL", "React"],
    images: [
      { src: "/images/astra/1.png", alt: "Astra — landing page" },
      { src: "/images/astra/2.png", alt: "Astra — dashboard com heatmap e tempo de foco" },
      { src: "/images/astra/3.png", alt: "Astra — GitHub Insights" },
      { src: "/images/astra/4.png", alt: "Astra — registro de sessão de foco" },
    ],
    imageFirst: false,
  },
  {
    index: "02",
    tag: "microserviços",
    name: "Lexo",
    repo: "https://github.com/KauanDiNubila/lexo-backend",
    url: "lexo · docker compose up",
    desc: "SaaS multi-tenant para escritórios de advocacia, decomposto (estratégia strangler) em 9 microsserviços com service discovery, API Gateway e banco por serviço.",
    features: [
      "Segurança distribuída: gateway valida o JWT e injeta identidade via headers de confiança, com anti-spoofing",
      "Resiliência com circuit breaker (Resilience4j) e tracing distribuído ponta a ponta (Zipkin)",
      "Lexo IA: resumo de processo, assistente jurídico e rascunho de petição via Google Gemini",
      "Portal do cliente por link mágico, sem login, com prazos e financeiro em tempo real",
    ],
    tech: ["Java 21", "Spring Boot", "Spring Cloud", "Kafka"],
    images: [
      { src: "/images/lexo/1.png", alt: "Lexo — landing page" },
      { src: "/images/lexo/2.png", alt: "Lexo — visão geral do escritório" },
      { src: "/images/lexo/3.png", alt: "Lexo — gestão de processos" },
      { src: "/images/lexo/4.png", alt: "Lexo — financeiro e honorários" },
    ],
    imageFirst: true,
  },
]

export function Projects() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div id="projetos" className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-16">
        <div ref={ref} className={`reveal ${revealed ? "revealed" : ""}`}>
          <p className="mb-2.5 text-[13px] font-semibold text-primary">02 / projetos</p>
          <h2 className="mb-3 text-[28px] font-bold">O que eu andei construindo</h2>
          <p className="mb-12 max-w-[560px] text-sm text-[#5A5A54]">
            Ainda não tenho experiência anterior pra listar aqui — então deixo os
            projetos falarem por mim.
          </p>

          {projects.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
