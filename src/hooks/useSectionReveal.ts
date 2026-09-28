import { useRef } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap"

export function useSectionReveal<T extends HTMLElement>(selector = "[data-reveal]") {
  const ref = useRef<T | null>(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(selector, ref.current)
      if (items.length === 0 || prefersReducedMotion()) return

      gsap.set(items, { autoAlpha: 0, y: 32 })
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      })
    },
    { scope: ref }
  )

  return ref
}
