export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  points: string[]
}

export const experiences: Experience[] = [
  {
    company: "SmartBrechó",
    role: "Desenvolvedor back-end",
    period: "out/2026 – atual",
    summary: "SaaS para brechós que automatiza a compra de lotes de roupas, da avaliação das peças à proposta enviada ao cliente pelo WhatsApp. Projeto para um cliente real.",
    points: [
      "Decisões de arquitetura registradas em ADRs e RFCs, com revisão de cada pull request antes do merge.",
      "Monólito modular em Clean Architecture com Java 25 e Spring Boot 4.1, e PostgreSQL com RLS isolando os dados de cada brechó.",
      "Tarefas e fases do MVP planejadas no Linear.",
    ],
  },
]
