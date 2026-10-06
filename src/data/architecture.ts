export type NodeKind = "service" | "infra" | "external" | "module"
export type EdgeKind = "route" | "sync" | "event" | "queue" | "dep" | "uses"

export type ArchNode = { id: string; label: string; sub?: string; x: number; y: number; kind: NodeKind; db?: boolean; desc: string }
export type ArchEdge = { from: string; to: string; kind: EdgeKind; bend?: number; both?: boolean }
export type Architecture = {
  width: number
  height: number
  caption: string
  box?: { x: number; y: number; w: number; h: number; label: string }
  layers: { label: string; ids: string[] }[]
  nodes: ArchNode[]
  edges: ArchEdge[]
  legend: EdgeKind[]
}

export const edgeLabel: Record<EdgeKind, string> = {
  route: "roteamento",
  sync: "chamada síncrona (Feign)",
  event: "evento (Kafka)",
  queue: "fila (RabbitMQ)",
  dep: "depende de",
  uses: "usa",
}

const lexo: Architecture = {
  width: 1000,
  height: 590,
  caption: "9 microsserviços, cada um com o próprio banco",
  layers: [
    { label: "Entrada", ids: ["fe", "gw", "eureka"] },
    { label: "Serviços", ids: ["auth", "cliente", "processo", "financeiro", "ia", "auditoria", "notificacao"] },
    { label: "Mensageria e infraestrutura", ids: ["kafka", "rabbit", "redis", "gemini"] },
  ],
  nodes: [
    { id: "fe", label: "Front-end", sub: "app + portal do cliente", x: 500, y: 40, kind: "external", desc: "React + Vite. O app do escritório e o portal do cliente falam só com o gateway." },
    { id: "gw", label: "API Gateway", sub: ":8090", x: 500, y: 140, kind: "service", desc: "Porta de entrada única. Valida o JWT, assina a identidade com HMAC, remove headers forjados e aplica rate limit por IP no Redis." },
    { id: "eureka", label: "Eureka", sub: "discovery", x: 820, y: 140, kind: "service", desc: "Registro e descoberta: o gateway e o Feign encontram os serviços pelo nome, não por endereço fixo." },
    { id: "auth", label: "auth", sub: ":8082", x: 90, y: 280, kind: "service", db: true, desc: "Usuários, organizações, 2FA e equipe. Enfileira e-mails no RabbitMQ." },
    { id: "cliente", label: "cliente", sub: ":8083", x: 260, y: 280, kind: "service", db: true, desc: "Clientes (CPF/CNPJ) e o portal do cliente, que agrega processos e financeiro via Feign. Publica CLIENTE_CRIADO e CLIENTE_EXCLUIDO." },
    { id: "processo", label: "processo", sub: ":8086", x: 430, y: 280, kind: "service", db: true, desc: "Processos, prazos e andamentos. Publica eventos no Kafka, consome a exclusão de cliente e enfileira e-mails de prazo." },
    { id: "financeiro", label: "financeiro", sub: ":8081", x: 600, y: 280, kind: "service", db: true, desc: "Honorários. Consulta cliente e processo via Feign e consome as exclusões para apagar em cascata." },
    { id: "ia", label: "ia", sub: ":8087", x: 760, y: 280, kind: "service", desc: "Resumo de processo, assistente jurídico e rascunho de petição via Gemini, com fallback que roda sem chave." },
    { id: "auditoria", label: "auditoria", sub: ":8084", x: 910, y: 280, kind: "service", db: true, desc: "Log de auditoria event-driven: grava cada evento de domínio publicado no Kafka." },
    { id: "rabbit", label: "RabbitMQ", sub: "retry + DLQ", x: 170, y: 430, kind: "infra", desc: "Fila de tarefas para e-mail, com retry e dead-letter queue." },
    { id: "redis", label: "Redis", sub: "cache + rate limit", x: 345, y: 430, kind: "infra", desc: "Cache de leitura com chave por organização e contadores de rate limit compartilhados entre instâncias." },
    { id: "kafka", label: "Kafka", sub: "eventos de domínio", x: 560, y: 430, kind: "infra", desc: "Log de eventos durável, lido por vários consumidores: a mesma exclusão chega à auditoria, ao financeiro e ao processo." },
    { id: "gemini", label: "Google Gemini", sub: "API externa", x: 800, y: 430, kind: "external", desc: "Modelo gemini-2.5-flash, no free tier." },
    { id: "notificacao", label: "notificacao", sub: ":8085", x: 170, y: 525, kind: "service", desc: "Consome a fila e envia os e-mails." },
  ],
  edges: [
    { from: "fe", to: "gw", kind: "route" },
    { from: "gw", to: "eureka", kind: "route" },
    { from: "gw", to: "auth", kind: "route" },
    { from: "gw", to: "cliente", kind: "route" },
    { from: "gw", to: "processo", kind: "route" },
    { from: "gw", to: "financeiro", kind: "route" },
    { from: "gw", to: "ia", kind: "route" },
    { from: "gw", to: "auditoria", kind: "route" },
    { from: "processo", to: "auth", kind: "sync", bend: -70 },
    { from: "processo", to: "cliente", kind: "sync", bend: -40 },
    { from: "cliente", to: "financeiro", kind: "sync", bend: -95 },
    { from: "financeiro", to: "processo", kind: "sync", bend: -40 },
    { from: "cliente", to: "kafka", kind: "event" },
    { from: "processo", to: "kafka", kind: "event", both: true },
    { from: "kafka", to: "auditoria", kind: "event" },
    { from: "kafka", to: "financeiro", kind: "event" },
    { from: "auth", to: "rabbit", kind: "queue" },
    { from: "processo", to: "rabbit", kind: "queue" },
    { from: "rabbit", to: "notificacao", kind: "queue" },
    { from: "cliente", to: "redis", kind: "uses" },
    { from: "processo", to: "redis", kind: "uses" },
    { from: "ia", to: "gemini", kind: "uses" },
  ],
  legend: ["route", "sync", "event", "queue", "uses"],
}

const astra: Architecture = {
  width: 1000,
  height: 640,
  caption: "Monólito modular: 10 módulos e nenhuma dependência circular",
  box: { x: 330, y: 20, w: 650, h: 610, label: "Spring Boot · VM Oracle Cloud" },
  layers: [
    { label: "Entrada e infraestrutura", ids: ["client", "cf", "vercel", "caddy", "neon", "turn", "oauth"] },
    { label: "Módulos · Spring Boot", ids: ["tracking", "user", "learning", "github", "roadmap", "social", "chat", "call", "stats", "privacy"] },
  ],
  nodes: [
    { id: "client", label: "Navegador · App Windows", sub: "React · Electron", x: 140, y: 50, kind: "external", desc: "Front-end em React na Vercel e um app Windows em Electron que abre o mesmo site." },
    { id: "cf", label: "Cloudflare", sub: "borda", x: 140, y: 150, kind: "infra", desc: "Proxy, HTTPS e rate limit por IP antes de qualquer requisição chegar à aplicação." },
    { id: "vercel", label: "Vercel", sub: "front-end", x: 60, y: 250, kind: "infra", desc: "Deploy automático do front a cada push." },
    { id: "caddy", label: "Caddy", sub: "HTTPS na origem", x: 220, y: 250, kind: "infra", desc: "Reverse proxy com Let's Encrypt na frente da API, na VM Always Free." },
    { id: "neon", label: "Neon", sub: "Postgres gerenciado", x: 140, y: 370, kind: "infra", desc: "Postgres serverless. O schema evolui por migrations Flyway." },
    { id: "turn", label: "coturn", sub: "relay TURN", x: 140, y: 470, kind: "infra", desc: "Relay das chamadas, com credenciais efêmeras geradas pelo back-end." },
    { id: "oauth", label: "GitHub · Google", sub: "OAuth2 + API", x: 140, y: 570, kind: "external", desc: "Login social e sincronização de commits, PRs e issues." },
    { id: "call", label: "call", x: 540, y: 80, kind: "module", desc: "Chamadas: estado em memória, sinalização WebRTC e credenciais TURN." },
    { id: "privacy", label: "privacy", x: 840, y: 80, kind: "module", desc: "Exportação dos dados do usuário (LGPD), juntando o que cada módulo expõe." },
    { id: "chat", label: "chat", x: 480, y: 190, kind: "module", desc: "Mensagens em tempo real por WebSocket/STOMP, cifradas em repouso." },
    { id: "stats", label: "stats", x: 760, y: 190, kind: "module", desc: "Dashboard, heatmap, streak e ranking. Só leitura: não tem tabela própria." },
    { id: "social", label: "social", x: 620, y: 295, kind: "module", desc: "Amizades e pedidos de amizade." },
    { id: "tracking", label: "tracking", x: 500, y: 395, kind: "module", desc: "O núcleo: sessões de foco e categorias. Tudo que é métrica nasce aqui." },
    { id: "roadmap", label: "roadmap", x: 800, y: 395, kind: "module", desc: "Roadmaps próprios e pré-definidos, com cursos fixados em cada etapa." },
    { id: "learning", label: "learning", x: 650, y: 490, kind: "module", desc: "Cursos, módulos de curso e metas diárias e semanais." },
    { id: "user", label: "user", x: 480, y: 585, kind: "module", desc: "Autenticação: JWT de 15 minutos, refresh token rotativo, OAuth2 e papéis." },
    { id: "github", label: "github", x: 820, y: 585, kind: "module", desc: "Conexão OAuth2, sincronização e insights do GitHub. Tokens cifrados com AES-256-GCM." },
  ],
  edges: [
    { from: "client", to: "cf", kind: "route" },
    { from: "cf", to: "vercel", kind: "route" },
    { from: "cf", to: "caddy", kind: "route" },
    { from: "caddy", to: "box", kind: "route" },
    { from: "box", to: "neon", kind: "uses" },
    { from: "call", to: "turn", kind: "uses" },
    { from: "github", to: "oauth", kind: "uses" },
    { from: "user", to: "oauth", kind: "uses" },
    { from: "tracking", to: "github", kind: "dep" },
    { from: "tracking", to: "learning", kind: "dep" },
    { from: "learning", to: "github", kind: "dep" },
    { from: "roadmap", to: "github", kind: "dep" },
    { from: "roadmap", to: "learning", kind: "dep" },
    { from: "social", to: "tracking", kind: "dep" },
    { from: "social", to: "user", kind: "dep" },
    { from: "chat", to: "github", kind: "dep" },
    { from: "chat", to: "social", kind: "dep" },
    { from: "chat", to: "user", kind: "dep" },
    { from: "call", to: "chat", kind: "dep" },
    { from: "call", to: "social", kind: "dep" },
    { from: "call", to: "user", kind: "dep" },
    { from: "stats", to: "learning", kind: "dep" },
    { from: "stats", to: "social", kind: "dep" },
    { from: "stats", to: "tracking", kind: "dep" },
    { from: "stats", to: "user", kind: "dep" },
    { from: "privacy", to: "chat", kind: "dep" },
    { from: "privacy", to: "github", kind: "dep" },
    { from: "privacy", to: "learning", kind: "dep" },
    { from: "privacy", to: "roadmap", kind: "dep" },
    { from: "privacy", to: "social", kind: "dep" },
    { from: "privacy", to: "tracking", kind: "dep" },
    { from: "privacy", to: "user", kind: "dep" },
  ],
  legend: ["route", "dep", "uses"],
}

export const architectures: Record<string, Architecture> = { lexo, astra }
