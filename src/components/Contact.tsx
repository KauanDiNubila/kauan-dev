import { useSectionReveal } from "@/hooks/useSectionReveal"
import { useDesktop } from "@/hooks/useDesktop"

const links = [
  { label: "GitHub", href: "https://github.com/KauanDiNubila" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kauan-di-nubila-933562263" },
]

export function Contact() {
  const ref = useSectionReveal<HTMLElement>()
  const desktop = useDesktop()

  return (
    <section id="contato" ref={ref} className="relative">
      <div className="mx-auto flex min-h-svh max-w-[1320px] flex-col justify-end px-5 pt-24 pb-8 md:px-10">
        {!desktop && (
          <img
            src="/hands-dither.png"
            alt=""
            aria-hidden
            className="mb-12 w-full [image-rendering:pixelated] [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]"
          />
        )}

        <div className="flex flex-col items-center text-center">
          <p data-reveal className="mb-6 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            05 — contato
          </p>
          <a
            data-reveal
            href="mailto:kauandinubila@gmail.com"
            className="font-serif text-[clamp(30px,6.4vw,92px)] leading-none tracking-[-0.01em] text-foreground italic transition-opacity hover:opacity-70"
          >
            kauandinubila@gmail.com
          </a>
          <p data-reveal className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-muted">
            Acompanhe meu trabalho e entre em contato pelas redes abaixo.
          </p>
          <div data-reveal className="mt-8 flex gap-8 font-mono text-[11px] tracking-[0.14em] uppercase">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-foreground"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20 flex justify-between border-t border-line pt-5 font-mono text-[10px] tracking-[0.14em] text-subtle uppercase">
          <span>© 2026 Kauan Di Nubila</span>
          <a href="#top" className="transition-colors hover:text-foreground">
            voltar ao topo ↑
          </a>
        </div>
      </div>
    </section>
  )
}
