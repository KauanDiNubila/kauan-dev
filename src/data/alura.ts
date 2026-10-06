export type Course = { name: string; start: string; end: string; hours?: number }
export type Track = { name: string; kind: "trilha" | "avulso"; hours?: number; courses: Course[] }

const c = (name: string, start: string, end: string, hours: number): Course => ({ name, start, end, hours })

export const aluraTracks: Track[] = [
  {
    name: "Aprofunde em Java com arquitetura de Microsserviços, Spring e RabbitMQ",
    kind: "trilha",
    hours: 38,
    courses: [
      c("Microsserviços na prática: entendendo a tomada de decisões", "19/03/2026", "20/03/2026", 8),
      c("Microsserviços na prática: implementando com Java e Spring", "23/03/2026", "25/03/2026", 10),
      c("Microsserviços na prática: IaC com CDK e deploy na AWS", "25/03/2026", "01/04/2026", 10),
      c("Microsserviços na prática: mensageria com RabbitMQ", "02/04/2026", "13/04/2026", 10),
    ],
  },
  {
    name: "Java e Spring Boot",
    kind: "trilha",
    hours: 32,
    courses: [
      c("Spring Boot 3: desenvolva uma API Rest em Java", "04/09/2025", "10/09/2025", 10),
      c("Spring Boot 3: aplique boas práticas e proteja uma API Rest", "19/01/2026", "21/01/2026", 12),
      c("Spring Boot 3: documente, teste e prepare uma API para o deploy", "26/01/2026", "10/02/2026", 10),
    ],
  },
  {
    name: "Boas Práticas em Java",
    kind: "trilha",
    hours: 30,
    courses: [
      c("Java e refatoração: melhorando códigos com boas práticas", "15/12/2025", "16/12/2025", 10),
      c("Boas práticas de programação: melhore o código de uma API Java", "17/12/2025", "29/12/2025", 10),
      c("Boas práticas de programação: automatizando testes com Java", "29/12/2025", "31/12/2025", 10),
    ],
  },
  {
    name: "Java Web: crie aplicações usando Spring Boot",
    kind: "trilha",
    hours: 40,
    courses: [
      c("Java: trabalhando com lambdas, streams e Spring Framework", "29/05/2025", "07/07/2025", 14),
      c("Java: persistência de dados e consultas com Spring Data JPA", "04/08/2025", "29/08/2025", 16),
      c("Java: criando sua primeira API e conectando ao front", "29/08/2025", "04/09/2025", 10),
    ],
  },
  {
    name: "Java com Spring Security",
    kind: "trilha",
    hours: 40,
    courses: [
      c("Java e Spring Security: proteja suas aplicações web", "23/02/2026", "03/03/2026", 8),
      c("Java e Spring Security: crie perfis e autorize requisições", "11/02/2026", "19/02/2026", 10),
      c("Java e Spring Security: proteja suas APIs REST", "03/03/2026", "10/03/2026", 12),
      c("Java e Spring Security: login com GitHub, Google e autenticação de 2 fatores", "23/02/2026", "18/03/2026", 10),
    ],
  },
  {
    name: "Praticando Java",
    kind: "trilha",
    hours: 38,
    courses: [
      c("Praticando Java: variáveis e tipos", "04/09/2025", "12/11/2025", 4),
      c("Praticando Java: condicionais if e else", "12/11/2025", "12/11/2025", 4),
      c("Praticando Java: laços for e while", "12/11/2025", "12/11/2025", 4),
      c("Praticando Java: Strings e Regex", "13/11/2025", "13/11/2025", 4),
      c("Praticando Java: data e hora", "12/11/2025", "12/11/2025", 4),
      c("Praticando Java: coleções e streams", "13/11/2025", "13/11/2025", 4),
      c("Praticando Java: Orientação a Objetos com classes, atributos e métodos", "12/11/2025", "12/11/2025", 4),
      c("Praticando Java: encapsulamento", "13/11/2025", "13/11/2025", 4),
      c("Praticando Java: herança, polimorfismo e interfaces", "13/11/2025", "13/11/2025", 6),
    ],
  },
  {
    name: "Aprenda a programar em Java com Orientação a Objetos",
    kind: "trilha",
    hours: 36,
    courses: [
      c("Java: criando a sua primeira aplicação", "12/05/2025", "14/05/2025", 8),
      c("Java: trabalhando com listas e coleções de dados", "14/05/2025", "22/05/2025", 8),
      c("Java: consumindo API, gravando arquivos e lidando com erros", "22/05/2025", "29/05/2025", 10),
      c("Java: aplicando a Orientação a Objetos", "14/05/2025", "19/05/2025", 10),
    ],
  },
  {
    name: "Iniciante em programação",
    kind: "trilha",
    hours: 29,
    courses: [
      c("Lógica de programação: mergulhe em programação com JavaScript", "28/04/2025", "29/04/2025", 6),
      c("Lógica de programação: explore funções e listas", "29/04/2025", "02/05/2025", 6),
      c("Git e GitHub: compartilhando e colaborando em projetos", "02/05/2025", "05/05/2025", 8),
      c("Lógica de programação: praticando com desafios", "05/05/2025", "12/05/2025", 8),
      c("Começando em Programação: carreira e primeiros passos", "28/04/2025", "28/04/2025", 1),
    ],
  },
  {
    name: "Java e Spring: avançando com Spring WebFlux e Spring Batch",
    kind: "trilha",
    hours: 18,
    courses: [
      c("Java e Spring: construindo aplicações reativas com WebFlux", "30/06/2026", "07/07/2026", 10),
      c("Java e Spring: Realizando processamento em lote com Spring Batch", "13/07/2026", "21/07/2026", 8),
    ],
  },
  {
    name: "Back-end",
    kind: "avulso",
    hours: 137,
    courses: [
      c("Swagger: documentando suas APIs", "10/02/2026", "11/02/2026", 8),
      c("Java exceções: aprenda a criar, lançar e controlar exceções", "11/12/2025", "12/12/2025", 8),
      c("PHP: criando sua aplicação", "09/06/2026", "09/06/2026", 8),
      c("Fundamentos da Arquitetura de Software Moderna", "20/05/2026", "21/05/2026", 16),
      c("Testes de Integração em Java: Garantindo Qualidade em Back-ends Modernos", "13/04/2026", "22/04/2026", 16),
      c("Back-ends Modernos em Java: Reatividade, Observabilidade e Performance", "25/05/2026", "05/06/2026", 12),
      c("Pensamento computacional: fundamentos da computação e lógica de programação", "30/10/2025", "15/12/2025", 8),
      c("Internet: entendendo os fundamentos da web", "18/08/2026", "26/08/2026", 8),
      c("Redes e Protocolos: fundamentos da web", "13/11/2025", "10/12/2025", 20),
      c("Carreira Desenvolvimento Back-End Java: Boas-vindas e primeiros passos", "30/10/2025", "30/10/2025", 1),
      c("Checkpoint Desenvolvimento Back-End Java - Nível 1", "12/01/2026", "13/01/2026", 2),
      c("Mensageria com Java: RabbitMQ e Kafka", "10/06/2026", "29/06/2026", 14),
      c("Padrões de Integração em Sistemas Distribuídos", "21/05/2026", "25/05/2026", 16),
    ],
  },
  {
    name: "DevOps",
    kind: "avulso",
    hours: 56,
    courses: [
      c("Kubernetes: Pods, Services e ConfigMaps", "11/08/2026", "16/09/2026", 8),
      c("Kubernetes: Deployments, Volumes e Escalabilidade", "16/09/2026", "22/09/2026", 8),
      c("Kubernetes: praticando e garantindo uma aplicação com LivenessProbe", "23/09/2026", "25/09/2026", 8),
      c("Integração Contínua: Pipeline Docker no Github Actions", "28/04/2026", "28/04/2026", 8),
      c("DevOps: trabalhando com repositórios no GitHub", "31/12/2025", "06/01/2026", 8),
      c("DevOps: construindo e gerindo containers com o Docker", "07/01/2026", "12/01/2026", 8),
      c("Integração Contínua: pipelines e testes automatizados com GitHub Actions", "23/04/2026", "27/04/2026", 8),
    ],
  },
  {
    name: "Inteligência Artificial",
    kind: "avulso",
    hours: 2,
    courses: [c("Entendendo a carreira Dev Full Stack do futuro: do zero com IA", "17/08/2026", "18/08/2026", 2)],
  },
]

export const parseDate = (d: string) => {
  const [day, month, year] = d.split("/").map(Number)
  return new Date(year, month - 1, day)
}
