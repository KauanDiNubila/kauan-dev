import { useEffect, useRef } from "react"

export function ScrollIndicator() {
  const track = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    const trackEl = track.current
    const thumbEl = thumb.current
    if (!trackEl || !thumbEl) return

    let trackH = 0
    let thumbH = 0
    let hideTimer: ReturnType<typeof setTimeout>

    const show = () => {
      trackEl.style.opacity = "1"
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        if (!dragging.current) trackEl.style.opacity = "0"
      }, 900)
    }

    const measure = () => {
      trackH = trackEl.clientHeight
      const doc = document.documentElement
      const ratio = doc.clientHeight / doc.scrollHeight
      thumbH = Math.max(32, trackH * ratio)
      thumbEl.style.height = `${thumbH}px`
      update()
    }

    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const frac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      thumbEl.style.transform = `translateY(${frac * (trackH - thumbH)}px)`
    }

    const onScroll = () => {
      update()
      show()
    }

    const scrollTo = (clientY: number, smooth: boolean) => {
      const rect = trackEl.getBoundingClientRect()
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const frac = Math.min(1, Math.max(0, (clientY - rect.top - thumbH / 2) / (trackH - thumbH)))
      window.scrollTo({ top: frac * max, behavior: smooth ? "smooth" : "instant" })
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true
      thumbEl.setPointerCapture(e.pointerId)
      show()
      if (e.target === thumbEl) return
      scrollTo(e.clientY, true)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return
      scrollTo(e.clientY, false)
    }

    const onPointerUp = () => {
      dragging.current = false
      show()
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    thumbEl.addEventListener("pointerdown", onPointerDown)
    trackEl.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      ro.disconnect()
      thumbEl.removeEventListener("pointerdown", onPointerDown)
      trackEl.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div
      ref={track}
      className="fixed top-[82px] right-1.5 bottom-3 z-20 hidden w-3 cursor-pointer touch-none opacity-0 transition-opacity duration-500 md:block"
    >
      <div className="absolute inset-y-0 right-1 w-[3px] rounded-full bg-foreground/[0.06]" />
      <div
        ref={thumb}
        className="absolute right-1 w-[3px] cursor-grab rounded-full bg-primary/70 transition-[width] duration-150 hover:w-[5px] active:w-[5px] active:cursor-grabbing"
      />
    </div>
  )
}
