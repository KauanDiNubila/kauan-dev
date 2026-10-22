import { useEffect, useState } from "react"
import { CV } from "@/data/cv"

const links = [
  { href: "#sobre", label: "sobre" },
  { href: "#experiencia", label: "experiência" },
  { href: "#projetos", label: "projetos" },
  { href: "#skills", label: "skills" },
  { href: "#formacao", label: "formação" },
  { href: "#contato", label: "contato" },
]

export function Nav() {
  const [named, setNamed] = useState(false)

  useEffect(() => {
    const update = () => setNamed(window.scrollY > window.innerHeight * 0.75)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-line bg-background/85 backdrop-blur-md md:border-b-0 md:bg-transparent md:bg-linear-to-b md:from-background md:via-background/80 md:to-transparent md:backdrop-blur-none">
      <div className="mx-auto flex h-14 max-w-[1320px] md:h-20 items-center justify-between px-5 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase md:px-10">
        <a
          href="#top"
          aria-hidden={!named}
          tabIndex={named ? undefined : -1}
          className={`transition-opacity duration-500 hover:opacity-100 ${named ? "opacity-60" : "pointer-events-none opacity-0"}`}
        >
          Kauan Di Nubila
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="opacity-60 transition-opacity hover:opacity-100">
              {l.label}
            </a>
          ))}
          <a
            href={CV}
            download
            className="rounded-full border border-foreground/30 px-3.5 py-1.5 transition-colors hover:border-foreground"
          >
            currículo ↓
          </a>
        </div>
        <div className="flex items-center gap-5 md:hidden">
          <a href={CV} download className="opacity-60 transition-opacity hover:opacity-100">
            currículo ↓
          </a>
          <a href="#contato" className="opacity-60 transition-opacity hover:opacity-100">
            contato
          </a>
        </div>
      </div>
    </nav>
  )
}
