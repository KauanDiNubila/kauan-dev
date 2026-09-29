import { useSectionReveal } from "@/hooks/useSectionReveal"
import { Card } from "@/components/ui/card"

type Tech = { name: string; icon?: string }

const icon = (slug: string) => `/icons/tech/${slug}.svg`

const categories: { title: string; items: Tech[] }[] = [
  {
    title: "Linguagens & back-end",
    items: [
      { name: "Java 21", icon: icon("java") },
      { name: "Spring Boot", icon: icon("spring-boot") },
      { name: "Spring Cloud", icon: icon("spring-cloud") },
      { name: "Spring Data JPA", icon: icon("spring-data-jpa") },
      { name: "Spring Security" },
      { name: "Swagger / OpenAPI", icon: icon("swagger-openapi") },
      { name: "TypeScript" },
    ],
  },
  {
    title: "Arquitetura & mensageria",
    items: [
      { name: "Microsserviços" },
      { name: "Apache Kafka", icon: icon("apache-kafka") },
      { name: "RabbitMQ", icon: icon("rabbitmq") },
      { name: "WebSocket / STOMP" },
      { name: "Resilience4j" },
    ],
  },
  {
    title: "Dados",
    items: [
      { name: "PostgreSQL", icon: icon("postgresql") },
      { name: "Redis", icon: icon("redis") },
      { name: "Flyway", icon: icon("flyway") },
    ],
  },
  {
    title: "DevOps, cloud & qualidade",
    items: [
      { name: "Docker", icon: icon("docker") },
      { name: "GitHub Actions", icon: icon("github-actions") },
      { name: "Git", icon: icon("git") },
      { name: "Maven", icon: icon("maven") },
      { name: "JUnit 5", icon: icon("junit-5") },
      { name: "Mockito" },
      { name: "Testcontainers" },
      { name: "Oracle Cloud", icon: icon("oracle-cloud") },
      { name: "Vercel", icon: icon("vercel") },
      { name: "Cloudflare", icon: icon("cloudflare") },
    ],
  },
]

export function Skills() {
  const ref = useSectionReveal<HTMLElement>()

  return (
    <section id="skills" ref={ref} className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 pt-36 pb-24 md:pt-24">
        <p data-reveal className="mb-2.5 font-mono text-[13px] font-semibold text-primary">
          03 / skills
        </p>
        <h2 data-reveal className="mb-10 text-[28px] font-bold sm:text-[34px]">
          Ferramentas do dia a dia
        </h2>

        <div className="grid max-w-[620px] grid-cols-1 gap-4">
          {categories.map((cat) => (
            <div key={cat.title} data-reveal>
              <Card className="h-full p-6">
                <div className="mb-4 flex items-center gap-2 font-mono">
                  <span className="text-sm text-primary">#</span>
                  <h3 className="text-[15px] font-bold">{cat.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2 font-mono">
                  {cat.items.map((t) => (
                    <li
                      key={t.name}
                      className="flex items-center gap-2 rounded-[4px] border border-border bg-secondary/70 px-2.5 py-1.5 text-xs text-muted-foreground"
                    >
                      {t.icon && (
                        <img src={t.icon} alt="" className="h-3.5 w-3.5 shrink-0" />
                      )}
                      {t.name}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
