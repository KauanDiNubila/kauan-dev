import { useEffect, useState } from "react"
import { useReveal } from "@/hooks/useReveal"

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
              <div key={cat.title} className="rounded-lg border border-border p-5.5">
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
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-3.5">
            {techIcons.map((tech) => {
              const isExpanded = expanded === tech.name
              return (
                <div
                  key={tech.name}
                  role="button"
                  tabIndex={0}
                  aria-label={tech.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded((cur) => (cur === tech.name ? null : tech.name))
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setExpanded((cur) => (cur === tech.name ? null : tech.name))
                    }
                  }}
                  className={`tech-item relative flex aspect-square cursor-pointer items-center justify-center rounded-[10px] border border-border bg-white p-2.5 ${
                    isExpanded ? "expanded" : expanded ? "dimmed" : ""
                  }`}
                >
                  {tech.logo ? (
                    <img src={tech.logo} alt={tech.name} loading="lazy" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-center text-[10px] font-semibold text-[#4B4B47]">{tech.name}</span>
                  )}
                  {isExpanded && (
                    <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-[3px] border border-border bg-white px-2 py-0.5 text-[11px] whitespace-nowrap text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                      {tech.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
