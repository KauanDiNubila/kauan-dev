import { useReveal } from "@/hooks/useReveal"

export function About() {
  const { ref, revealed } = useReveal<HTMLDivElement>()

  return (
    <div id="sobre" className="border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-16">
        <div ref={ref} className={`reveal ${revealed ? "revealed" : ""}`}>
          <p className="mb-2.5 text-[13px] font-semibold text-primary">01 / sobre mim</p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.4fr]">
            <h2 className="max-w-[320px] text-[28px] font-bold">
              Back-end é onde eu penso melhor.
            </h2>
            <div className="max-w-[560px] text-[15px] text-muted-foreground">
              <p className="mb-4">
                Gosto de arquitetura que não precisa de manual pra ser entendida, de
                API que responde rápido e de código que o próximo dev (ou eu, seis
                meses depois) consiga ler sem sofrer.
              </p>
              <p>
                No dia a dia trabalho principalmente com <strong className="text-foreground">Java</strong> e{" "}
                <strong className="text-foreground">Spring Boot</strong>, construindo sistemas de ponta
                a ponta — da modelagem do banco até o endpoint que o front consome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
