export type Project = {
  index: string
  slug: string
  name: string
  tag: string
  summary: string
  repo: string
  live: string
  desc: string
  stats: { value: string; label: string }[]
  features: string[]
  tech: string[]
}

export const projects: Project[] = [
  {
    index: "01",
    slug: "astra",
    name: "Astra",
    tag: "em produção",
    summary: "Ecossistema de estudos e produtividade full-stack",
    repo: "https://github.com/KauanDiNubila/astra",
    live: "https://astra-app.dev",
    desc: "Ecossistema de estudos e produtividade full-stack: sessões de foco viram a única fonte de dados da qual progresso, metas, streaks, heatmaps e ranking são derivados — nada fica pré-calculado. Tem camada social em tempo real (amigos, chat cifrado) e integração com o GitHub, conectando a atividade real de desenvolvimento ao tempo estudado.",
    stats: [
      { value: "0", label: "falhas no scan OWASP ZAP" },
      { value: "2", label: "provedores OAuth2 (Google e GitHub)" },
      { value: "4", label: "peças de infra separadas" },
    ],
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
    slug: "lexo",
    name: "Lexo",
    tag: "microsserviços",
    summary: "SaaS multi-tenant para escritórios de advocacia",
    repo: "https://github.com/KauanDiNubila/lexo-backend",
    live: "https://lexo-kauan1.duckdns.org",
    desc: "SaaS multi-tenant para escritórios de advocacia, em 9 microsserviços independentes, cada um com banco próprio. Construído para explorar os desafios reais de sistemas distribuídos: comunicação entre serviços, consistência, processamento assíncrono e isolamento de dados.",
    stats: [
      { value: "9", label: "microsserviços com banco próprio" },
      { value: "2", label: "sistemas de mensageria (Kafka e RabbitMQ)" },
      { value: "1", label: "gateway validando toda requisição" },
    ],
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

export const shots = (p: Project) => [1, 2, 3, 4].map((n) => `/images/${p.slug}/${n}.png`)
export const cover = (p: Project) => `/images/${p.slug}/2.png`
