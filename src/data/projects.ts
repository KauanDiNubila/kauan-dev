export type Project = {
  index: string
  slug: string
  name: string
  tag: string
  summary: string
  repo: string
  live: string
  store?: string
  desc: string
  capabilities: { name: string; text: string }[]
  features: string[]
  decisions: { q: string; a: string }[]
  tech: string[]
}

export const projects: Project[] = [
  {
    index: "01",
    slug: "astra",
    name: "Astra",
    tag: "na Microsoft Store",
    summary: "Ecossistema de estudos e produtividade full-stack",
    repo: "https://github.com/KauanDiNubila/astra",
    live: "https://astra-app.dev",
    store: "https://apps.microsoft.com/detail/9NRB7QNCJGSP?hl=pt-br&gl=BR",
    desc: "Plataforma de estudos e produtividade com camada social em tempo real (amigos e chat) e integração com o GitHub.",
    capabilities: [
      { name: "Sessões de foco", text: "Pomodoro ou registro manual, por categoria" },
      { name: "Cursos e roadmaps", text: "com metas diárias e semanais" },
      { name: "Dashboard", text: "heatmap, streak e tempo por categoria" },
      { name: "Social", text: "amigos, ranking e chat em tempo real" },
      { name: "Chamadas", text: "voz e vídeo com compartilhamento de tela" },
      { name: "GitHub", text: "commits, PRs e issues ligados ao tempo estudado" },
    ],
    features: [
      "Senha em BCrypt, com recusa de senhas vazadas, e login com Google e GitHub.",
      "Exportação de dados da LGPD montada a partir do que cada módulo expõe, sem acessar o banco dos vizinhos.",
      "Testes de integração em Postgres real, rodando no CI.",
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
        q: "Por que cache no navegador?",
        a: "Para trocar de página sem esperar a rede. O cache mostra a cópia na hora e sempre confere com o servidor, então nunca exibe dado velho. Num teste com latência simulada, percorrer as 4 páginas principais ficou 73% mais rápido.",
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
    desc: "SaaS multi-tenant para escritórios de advocacia, construído para explorar os desafios reais de sistemas distribuídos.",
    capabilities: [
      { name: "Clientes e processos", text: "CPF/CNPJ, prazos e andamentos" },
      { name: "Agenda e financeiro", text: "prazos e honorários" },
      { name: "Portal do cliente", text: "acompanhamento sem login" },
      { name: "IA jurídica", text: "resumo, assistente e petições" },
      { name: "Equipe e segurança", text: "papéis, 2FA e auditoria" },
      { name: "Avisos por e-mail", text: "notificação automática de prazos" },
    ],
    features: [
      "Exclusão em cascata entre serviços por eventos no Kafka, sem transação distribuída: cada serviço apaga o que é seu.",
      "Se um serviço cair, o circuit breaker corta as chamadas e responde na hora, em vez de deixar a requisição presa.",
      "Service discovery com Eureka: os serviços se encontram pelo nome, não por endereço fixo.",
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
    ],
    tech: ["Java 21", "Spring Boot", "Spring Cloud", "Kafka"],
  },
]

const SHOTS: Record<string, number[]> = { astra: [2, 3], lexo: [1, 2] }

export const shots = (p: Project) => (SHOTS[p.slug] ?? [1, 2]).map((n) => `/images/${p.slug}/${n}.png`)
