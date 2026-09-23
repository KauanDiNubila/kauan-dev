export function Hero() {
  return (
    <div id="top" className="relative mx-auto max-w-[1080px] overflow-hidden px-6 pt-24 pb-20">
      <div
        className="hero-scan pointer-events-none absolute inset-0 bg-[length:16%_100%] bg-no-repeat opacity-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(59,130,246,0.18), transparent)",
          backgroundPosition: "-20% 0",
          animation: "heroScan 1s cubic-bezier(.4,0,.2,1) .1s both",
        }}
      />

      <h1
        className="hero-anim mb-3 text-[42px] font-bold tracking-[-0.5px] sm:text-[58px]"
        style={{ animation: "heroNameIn .5s cubic-bezier(.16,1,.3,1) .05s both" }}
      >
        Kauan Di Nubila
      </h1>

      <div
        className="mb-6 inline-block whitespace-nowrap text-[22px] font-semibold text-primary"
        style={{ animation: "heroRoleReveal .5s steps(22,end) .4s both" }}
      >
        // Desenvolvedor Back-End
      </div>

      <p
        className="hero-anim mb-8 max-w-[560px] text-[16px] text-muted-foreground"
        style={{ animation: "heroFadeUp .45s cubic-bezier(.16,1,.3,1) .7s both" }}
      >
        Foco em Java, arquitetura de software e sistemas bem construídos.
      </p>

      <div className="flex flex-wrap gap-3.5">
        <a
          href="#projetos"
          className="hero-anim rounded bg-primary px-[22px] py-3 text-sm font-semibold text-primary-foreground"
          style={{ animation: "heroFadeUp .4s cubic-bezier(.16,1,.3,1) 1.3s both" }}
        >
          ver projetos
        </a>
        <a
          href="#contato"
          className="hero-anim rounded border border-border px-[22px] py-3 text-sm font-semibold text-foreground"
          style={{ animation: "heroFadeUp .4s cubic-bezier(.16,1,.3,1) 1.37s both" }}
        >
          falar comigo
        </a>
      </div>
    </div>
  )
}
