import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap"
import { PROJECTS_PIN_SCALE } from "@/components/Projects"

type Spec = { id: string; start: string; end: string | (() => string) }

const enter = (id: string): Spec => ({ id, start: "clamp(top 70%)", end: "clamp(top 20%)" })

const build = (pinned: boolean, target: React.RefObject<number>) => {
  const specs: Spec[] = [
    enter("sobre"),
    enter("projetos"),
    pinned
      ? { id: "projetos-pin", start: "top 70px", end: () => `+=${window.innerHeight * PROJECTS_PIN_SCALE}` }
      : enter("projeto-lexo"),
    enter("skills"),
    enter("formacao"),
    enter("contato"),
  ]
  const parts = specs.map(() => 0)

  specs.forEach((spec, i) => {
    const el = document.getElementById(spec.id)
    if (!el) return
    const update = (self: ScrollTrigger) => {
      parts[i] = self.progress
      target.current = parts.reduce((sum, p) => sum + p, 0)
    }
    ScrollTrigger.create({ trigger: el, start: spec.start, end: spec.end, onUpdate: update, onRefresh: update })
  })
}

export function useParticleScroll() {
  const target = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => build(true, target))
    mm.add("(max-width: 767px)", () => build(false, target))
    return () => mm.revert()
  }, [])

  return target
}
