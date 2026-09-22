const links = [
  { href: "#sobre", label: "sobre" },
  { href: "#projetos", label: "projetos" },
  { href: "#skills", label: "skills" },
  { href: "#contato", label: "contato" },
]

export function Nav() {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-[70px] max-w-[1080px] items-center justify-between px-6">
        <a href="#top" className="text-[15px] font-bold text-foreground">
          kauan<span className="text-primary">.</span>dev
        </a>
        <div className="hidden gap-7 text-[13px] text-muted-foreground sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
