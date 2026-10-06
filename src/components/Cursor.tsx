import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dot.current
    if (!el || !window.matchMedia("(pointer: fine)").matches) return
    document.documentElement.classList.add("has-cursor")
    const x = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" })
    const y = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" })
    let hovering = false

    const onMove = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" })
      const over = !!(e.target as Element | null)?.closest?.("a, button, [data-cursor]")
      if (over !== hovering) {
        hovering = over
        gsap.to(el, { scale: over ? 4.5 : 1, duration: 0.35, ease: "power3.out" })
      }
    }
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 })

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    return () => {
      document.documentElement.classList.remove("has-cursor")
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[70] -mt-1 -ml-1 size-2 rounded-full bg-white opacity-0 mix-blend-difference"
    />
  )
}
