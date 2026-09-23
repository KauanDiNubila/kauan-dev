import { useEffect, useState } from "react"
import { useReveal } from "@/hooks/useReveal"
import { Card } from "@/components/ui/card"
import { TechSphere } from "@/components/TechSphere"

const categories = [
  { title: "Linguagens", items: ["Java 21", "TypeScript"] },
  {
    title: "Back-end & arquitetura",
    items: ["Spring Boot", "Spring Cloud", "Spring Security", "Microsserviços", "WebSocket / STOMP"],
  },
  { title: "Dados & mensageria", items: ["PostgreSQL", "Redis", "Apache Kafka", "RabbitMQ"] },
  {
    title: "DevOps & qualidade",
    items: ["Docker", "GitHub Actions (CI)", "JUnit 5 / Testcontainers", "Resilience4j"],
  },
]

const techIcons: { name: string; logo: string | null }[] = [
  ["Java", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"],
  ["Spring Boot", "https://cdn.simpleicons.org/spring"],
  ["Spring Cloud", "https://cdn.simpleicons.org/spring"],
  ["PostgreSQL", "https://cdn.simpleicons.org/postgresql"],
  ["Spring Data JPA", "https://cdn.simpleicons.org/hibernate"],
  ["Flyway", "https://cdn.simpleicons.org/flyway"],
  ["Redis", "https://cdn.simpleicons.org/redis"],
  ["Apache Kafka", "https://cdn.simpleicons.org/apachekafka"],
  ["RabbitMQ", "https://cdn.simpleicons.org/rabbitmq"],
  ["Swagger/OpenAPI", "https://cdn.simpleicons.org/swagger"],
  ["JUnit 5", "https://cdn.simpleicons.org/junit5"],
  ["Mockito", null],
  ["Docker", "https://cdn.simpleicons.org/docker"],
  ["GitHub Actions", "https://cdn.simpleicons.org/githubactions"],
  ["Maven", "https://cdn.simpleicons.org/apachemaven"],
  ["Git", "https://cdn.simpleicons.org/git"],
  ["Oracle Cloud", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg"],
  ["Vercel", "https://cdn.simpleicons.org/vercel"],
  ["Cloudflare", "https://cdn.simpleicons.org/cloudflare"],
].map(([name, logo]) => ({ name: name as string, logo }))

const CENTER_INDEX = 9
const sphereTechs = (() => {
  const rest = techIcons.filter((t) => t.name !== "Java")
  const java = techIcons.find((t) => t.name === "Java")!
  return [...rest.slice(0, CENTER_INDEX), java, ...rest.slice(CENTER_INDEX)]
})()

export function Skills() {
  const { ref, revealed } = useReveal<HTMLDivElement>()
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!expanded) return
    const closeOnOutsideClick = () => setExpanded(null)
    document.addEventListener("click", closeOnOutsideClick)
    return () => document.removeEventListener("click", closeOnOutsideClick)
  }, [expanded])

  return (
    <div id="skills" className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-16">
        <div ref={ref} className={`reveal ${revealed ? "revealed" : ""}`}>
          <p className="mb-2.5 text-[13px] font-semibold text-primary">03 / skills</p>
          <h2 className="mb-2 text-[28px] font-bold">Ferramentas do dia a dia</h2>
          <p className="mb-7 text-[13px] text-[#8B8B85]">clique num ícone pra ver o nome</p>

          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {categories.map((cat) => (
              <Card key={cat.title} className="p-5.5">
                <div className="mb-3.5 flex items-center gap-2">
                  <span className="text-sm text-primary">#</span>
                  <h3 className="text-[15px] font-bold">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((it) => (
                    <span key={it} className="rounded-[3px] bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      {it}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <TechSphere
            techs={sphereTechs}
            expanded={expanded}
            onToggle={(name) => setExpanded((cur) => (cur === name ? null : name))}
          />
        </div>
      </div>
    </div>
  )
}
