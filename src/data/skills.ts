export type Evidence = { project: "Astra" | "Lexo"; text: string }
export type Skill = { name: string; used?: Evidence[] }
export type Category = { title: string; skills: Skill[] }

export const categories: Category[] = [
  {
    title: "Linguagens & back-end",
    skills: [
      {
        name: "Java 21",
        used: [
          { project: "Astra", text: "linguagem do back-end inteiro" },
          { project: "Lexo", text: "linguagem dos 9 microsserviços" },
        ],
      },
      {
        name: "Spring Boot",
        used: [
          { project: "Astra", text: "base da API" },
          { project: "Lexo", text: "base de cada microsserviço" },
        ],
      },
      { name: "Spring Cloud", used: [{ project: "Lexo", text: "gateway e comunicação entre serviços" }] },
      { name: "Spring Data JPA" },
      {
        name: "Spring Security",
        used: [
          { project: "Astra", text: "JWT com refresh token rotativo e OAuth2 com Google e GitHub" },
          { project: "Lexo", text: "JWT validado no gateway e identidade propagada com HMAC" },
        ],
      },
      { name: "Swagger / OpenAPI" },
      { name: "TypeScript" },
    ],
  },
  {
    title: "Arquitetura & mensageria",
    skills: [
      { name: "Microsserviços", used: [{ project: "Lexo", text: "9 serviços independentes, cada um com banco próprio" }] },
      {
        name: "Apache Kafka",
        used: [{ project: "Lexo", text: "eventos de domínio do cliente-service e processo-service, lidos pela auditoria e pelas exclusões em cascata" }],
      },
      {
        name: "RabbitMQ",
        used: [{ project: "Lexo", text: "fila de e-mails para o notificacao-service, com retry e Dead Letter Queue" }],
      },
      { name: "WebSocket / STOMP", used: [{ project: "Astra", text: "camada social em tempo real: amigos e chat" }] },
      { name: "Resilience4j", used: [{ project: "Lexo", text: "circuit breaker entre serviços" }] },
    ],
  },
  {
    title: "Dados",
    skills: [
      { name: "PostgreSQL", used: [{ project: "Astra", text: "banco gerenciado no Neon" }] },
      { name: "Redis", used: [{ project: "Lexo", text: "cache e rate limiting com chave por tenant" }] },
      { name: "Flyway" },
    ],
  },
  {
    title: "DevOps, cloud & qualidade",
    skills: [
      { name: "Docker", used: [{ project: "Astra", text: "Docker Compose + Caddy na VM de produção" }] },
      { name: "GitHub Actions", used: [{ project: "Astra", text: "pipeline de CI" }] },
      { name: "Git" },
      { name: "Maven" },
      { name: "JUnit 5" },
      { name: "Mockito" },
      { name: "Testcontainers", used: [{ project: "Astra", text: "testes de integração com Postgres real" }] },
      { name: "Oracle Cloud", used: [{ project: "Astra", text: "VM que roda o back-end" }] },
      { name: "Vercel", used: [{ project: "Astra", text: "hospedagem do front-end" }] },
      { name: "Cloudflare", used: [{ project: "Astra", text: "na borda, na frente da aplicação" }] },
    ],
  },
]
