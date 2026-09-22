import { useReveal } from "@/hooks/useReveal"

export function Contact() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div id="contato" className="border-t border-border">
      <div
        ref={ref}
        className={`reveal ${revealed ? "revealed" : ""} mx-auto max-w-[1080px] px-6 py-20 text-center`}
      >
        <p className="mb-2.5 text-[13px] font-semibold text-primary">04 / contato</p>
        <h2 className="mb-3.5 text-[32px] font-bold">Bora conversar sobre o próximo projeto?</h2>
        <p className="mb-8 text-[15px] text-[#5A5A54]">Respondo rápido no GitHub e no LinkedIn.</p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <a
            href="https://github.com/KauanDiNubila"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded bg-foreground px-6 py-3.5 text-sm font-semibold text-background"
          >
            GitHub <span>↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/kauan-di-nubila-933562263"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-border px-6 py-3.5 text-sm font-semibold text-foreground"
          >
            LinkedIn <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
