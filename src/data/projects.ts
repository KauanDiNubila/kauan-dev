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
  decisions: { q: string; a: string }[]
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
    decisions: [
      {
        q: "Por que monólito modular?",
        a: "Um produto com um só desenvolvedor não precisa de rede entre módulos. As fronteiras ficam no código: um módulo só conversa com outro por services públicos, e o grafo de dependências não tem ciclos.",
      },
      {
        q: "Por que a sessão é a única fonte de dados?",
        a: "Progresso, metas, streak, heatmap e ranking são calculados a partir das sessões, nunca guardados em tabela própria. Não existe número que possa ficar desatualizado em relação ao que realmente aconteceu.",
      },
      {
        q: "Por que refresh token rotativo?",
        a: "O token de acesso dura 15 minutos. O refresh token muda a cada uso; se um token já usado reaparecer, é sinal de roubo e a sessão inteira é revogada.",
      },
      {
        q: "Por que uma VM na Oracle e não Render?",
        a: "É gratuita e fica sempre ligada. No Render o app hiberna e a primeira requisição demora; na VM Always Free, com Docker Compose e Caddy, a API responde sempre.",
      },
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
      "Comunicação híbrida: OpenFeign para respostas síncronas imediatas. Kafka carrega eventos de domínio publicados por cliente-service e processo-service: o auditoria-service registra todos, e o financeiro-service e o processo-service consomem as exclusões para apagar em cascata; RabbitMQ processa e-mails enfileirados por auth-service e processo-service, consumidos pelo notificacao-service, com retry e Dead Letter Queue.",
      "Resiliência com circuit breaker (Resilience4j), cache e rate limiting via Redis (chave por tenant) e tracing distribuído ponta a ponta com Micrometer e Zipkin.",
      "Lexo IA: resumo de processo, assistente jurídico e rascunho de petição via Google Gemini, com fallback heurístico que roda sem chave e custo zero.",
      "Portal do cliente por link mágico, sem login, com prazos e financeiro em tempo real.",
    ],
    decisions: [
      {
        q: "Por que microsserviços?",
        a: "Para exercitar arquitetura distribuída de verdade: discovery, gateway, resiliência e observabilidade. Num produto real em estágio inicial, um monólito modular seria mais pragmático; aqui o objetivo era dominar os padrões.",
      },
      {
        q: "Por que Kafka e RabbitMQ?",
        a: "Kafka é um log de eventos durável, lido por vários consumidores: a mesma exclusão chega à auditoria, ao financeiro e ao processo. RabbitMQ é uma fila de tarefas, com retry e DLQ, para trabalho pontual como enviar um e-mail.",
      },
      {
        q: "Por que validar o JWT só no gateway?",
        a: "O token é validado uma vez, na borda. Os serviços recebem a identidade em headers assinados com HMAC e continuam simples e stateless.",
      },
      {
        q: "Por que um banco por serviço?",
        a: "Cada serviço evolui de forma independente. O custo é não ter JOIN entre domínios, resolvido com Feign quando a resposta precisa ser imediata e com eventos quando pode ser assíncrona.",
      },
    ],
    tech: ["Java 21", "Spring Boot", "Spring Cloud", "Kafka"],
  },
]

export const shots = (p: Project) => [1, 2, 3, 4].map((n) => `/images/${p.slug}/${n}.png`)
