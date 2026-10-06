const links = [
  { href: "#sobre", n: "01", label: "sobre" },
  { href: "#projetos", n: "02", label: "projetos" },
  { href: "#skills", n: "03", label: "skills" },
  { href: "#formacao", n: "04", label: "formação" },
  { href: "#contato", n: "05", label: "contato" },
]

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 bg-linear-to-b from-background via-background/80 to-transparent">
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 font-mono text-[11px] tracking-[0.14em] text-foreground uppercase md:px-10">
        <span className="opacity-60">portfólio — 2026</span>
        <div className="hidden gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group flex gap-1.5 opacity-60 transition-opacity hover:opacity-100">
              <span className="opacity-50">{l.n}</span>
              {l.label}
            </a>
          ))}
        </div>
        <a href="#contato" className="opacity-60 transition-opacity hover:opacity-100 md:hidden">
          contato
        </a>
      </div>
    </nav>
  )
}
