import { Carousel_002 } from "@/components/ui/skiper-ui/skiper48"

type Project = {
  index: string
  tag: string
  name: string
  repo: string
  url: string
  desc: string
  features: string[]
  tech: string[]
  images: { src: string; alt: string }[]
  imageFirst?: boolean
}

export function ProjectCard({ project }: { project: Project }) {
  const text = (
    <div>
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="text-xs text-[#8B8B85]">{project.index}</span>
        <span className="rounded-[3px] border border-primary/30 bg-primary/[0.08] px-2 py-0.5 text-[11px] text-primary">
          {project.tag}
        </span>
      </div>
      <h3 className="mb-3 text-[26px] font-bold">
        <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">
          {project.name}
        </a>
      </h3>
      <p className="mb-5 text-sm text-muted-foreground">{project.desc}</p>
      <div className="mb-5.5 flex flex-col gap-2">
        {project.features.map((f) => (
          <div key={f} className="flex gap-2 text-[13px] text-[#4B4B47]">
            <span className="shrink-0 text-primary">›</span>
            {f}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded-[3px] bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
    </div>
  )

  const demo = (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-col overflow-hidden rounded-[10px] shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.1)]">
        {/* tab bar */}
        <div className="flex h-11 items-center bg-[#202124] pr-2">
          <div className="flex gap-2 px-3.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex h-full flex-1 items-end pl-1">
            <div className="flex h-[34px] min-w-[120px] max-w-[220px] items-center gap-2 rounded-t-lg bg-[#35363a] px-3 text-xs text-[#e8eaed]">
              <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[#5f6368]" />
              <span className="truncate">New Tab</span>
            </div>
          </div>
        </div>
        {/* url toolbar */}
        <div className="flex h-10 items-center gap-1 bg-[#35363a] px-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <span className="h-4 w-4 rounded-full bg-[#9aa0a6] opacity-40" />
          </div>
          <div className="mx-1.5 flex h-[30px] flex-1 items-center gap-2 overflow-hidden rounded-full bg-[#282a2d] px-3.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#9aa0a6] opacity-40" />
            <span className="truncate text-[13px] text-[#e8eaed]">{project.url}</span>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <span className="h-4 w-4 rounded-full bg-[#9aa0a6] opacity-40" />
          </div>
        </div>
        {/* content — aspect matches the source screenshots (1440x900) exactly, so nothing gets cropped */}
        <div className="aspect-[1440/900] w-full overflow-hidden bg-[#0f1115]">
          <Carousel_002
            images={project.images}
            loop={false}
            spaceBetween={30}
            width="100%"
            height="100%"
          />
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-[#8B8B85]">arraste para navegar</p>
    </div>
  )

  return (
    <div className="mb-22 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      {project.imageFirst ? (
        <>
          <div className="md:order-1">{demo}</div>
          <div className="md:order-2">{text}</div>
        </>
      ) : (
        <>
          <div className="md:order-1">{text}</div>
          <div className="md:order-2">{demo}</div>
        </>
      )}
    </div>
  )
}

export type { Project }
