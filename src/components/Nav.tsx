import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/lib/gsap"

const links = [
  { href: "#sobre", label: "sobre" },
  { href: "#projetos", label: "projetos" },
  { href: "#skills", label: "skills" },
  { href: "#formacao", label: "formação" },
]

export function Nav() {
  const [active, setActive] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const indicatorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el)
    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(`#${entry.target.id}`, entry.intersectionRatio)
        let best: string | null = null
        let bestRatio = 0
        for (const [href, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = href
          }
        }
        setActive(bestRatio > 0.1 ? best : null)
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: "-70px 0px -40% 0px" }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const move = () => {
      const indicator = indicatorRef.current
      if (!indicator) return
      const el = active ? linkRefs.current.get(active) : null
      if (!el) {
        indicator.style.opacity = "0"
        return
      }
      indicator.style.opacity = "1"
      indicator.style.transform = `translateX(${el.offsetLeft}px)`
      indicator.style.width = `${el.offsetWidth}px`
    }
    move()
    window.addEventListener("resize", move)
    return () => window.removeEventListener("resize", move)
  }, [active])

  return (
    <nav
      className={`sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled ? "border-border bg-background/70 backdrop-blur-md" : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-[1080px] items-center justify-between px-6">
        <a href="#top" className="font-mono text-[15px] font-bold text-foreground">
          kauan<span className="text-primary">.</span>dev
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          <div className="relative flex h-full items-center gap-7 font-mono text-[13px] text-muted-foreground">
            {links.map((l) => (
              <a
                key={l.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(l.href, el)
                  else linkRefs.current.delete(l.href)
                }}
                href={l.href}
                className={`transition-colors hover:text-foreground ${active === l.href ? "text-foreground" : ""}`}
              >
                {l.label}
              </a>
            ))}
            <span
              ref={indicatorRef}
              aria-hidden
              className={`pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-primary opacity-0 ${
                prefersReducedMotion() ? "" : "transition-[transform,width,opacity] duration-300 ease-out"
              }`}
            />
          </div>
          <a
            href="#contato"
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-[13px] text-primary transition-colors hover:bg-primary hover:text-background"
          >
            contato
          </a>
        </div>
      </div>
    </nav>
  )
}
