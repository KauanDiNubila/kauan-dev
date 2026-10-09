import { CV } from "@/data/cv"

const links = [
  { href: "#sobre", n: "01", label: "sobre" },
  { href: "#projetos", n: "02", label: "projetos" },
  { href: "#skills", n: "03", label: "skills" },
  { href: "#formacao", n: "04", label: "formação" },
  { href: "#contato", n: "05", label: "contato" },
]

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-line bg-background/85 backdrop-blur-md md:border-b-0 md:bg-transparent md:bg-linear-to-b md:from-background md:via-background/80 md:to-transparent md:backdrop-blur-none">
      <div className="mx-auto flex h-14 max-w-[1320px] md:h-20 items-center justify-between px-5 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase md:px-10">
        <span className="opacity-60">portfólio — 2026</span>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group flex gap-1.5 opacity-60 transition-opacity hover:opacity-100">
              <span className="opacity-50">{l.n}</span>
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
