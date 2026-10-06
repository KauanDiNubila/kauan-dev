export type Degree = {
  course: string
  institution: string
  period: string
  status: "cursando" | "concluído"
}

export const degrees: Degree[] = [
  {
    course: "Análise e Desenvolvimento de Sistemas",
    institution: "Universidade Estácio de Sá",
    period: "2025 – 2027",
    status: "cursando",
  },
]
