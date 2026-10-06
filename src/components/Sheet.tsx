import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { Dialog } from "radix-ui"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap"
import { cn } from "@/lib/utils"

type Variant = "full" | "side"

type Props = {
  open: boolean
  onClose: () => void
  opener: RefObject<HTMLElement | null>
  title: string
  description?: string
  variant: Variant
  children: ReactNode
}

export function Sheet({ open, ...rest }: Props) {
  const [mounted, setMounted] = useState(open)
  const exit = useCallback(() => setMounted(false), [])

  if (open && !mounted) setMounted(true)
  if (!mounted) return null

  return (
    <Dialog.Root open onOpenChange={(next) => !next && rest.onClose()}>
      <Dialog.Portal>
        <Panel open={open} onExited={exit} {...rest} />
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Panel({
  open,
  onExited,
  opener,
  title,
  description,
  variant,
  children,
}: Omit<Props, "onClose"> & { onExited: () => void }) {
  const overlay = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    if (!overlay.current || !panel.current) return
    const d = prefersReducedMotion() ? 0.01 : 1
    const desktop = window.matchMedia("(min-width: 768px)").matches
    const from = variant === "full" ? { yPercent: 4, autoAlpha: 0 } : desktop ? { xPercent: 100 } : { yPercent: 100 }

    tl.current = gsap
      .timeline({ paused: true, onReverseComplete: onExited })
      .fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 * d, ease: "power2.out" })
      .fromTo(
        panel.current,
        from,
        { xPercent: 0, yPercent: 0, autoAlpha: 1, duration: 0.7 * d, ease: "expo.out" },
        0
      )
      .fromTo(
        panel.current.querySelectorAll("[data-sheet-item]"),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5 * d, stagger: 0.035 * d, ease: "power3.out" },
        0.15 * d
      )

    return () => {
      tl.current = null
    }
  }, [])

  useEffect(() => {
    const t = tl.current
    if (!t) return
    if (open) {
      t.timeScale(1).play()
      return
    }
    if (t.time() === 0) {
      onExited()
      return
    }
    t.timeScale(1.8).reverse()
  }, [open, onExited])

  return (
    <>
      <Dialog.Overlay ref={overlay} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <Dialog.Content
        ref={panel}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          opener.current?.focus({ preventScroll: true })
        }}
        className={cn(
          "thin-scrollbar fixed z-50 overflow-y-auto overscroll-contain bg-background outline-none",
          variant === "full"
            ? "inset-0"
            : "inset-x-0 bottom-0 max-h-[88svh] border-t border-line md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[560px] md:border-t-0 md:border-l"
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <Dialog.Description className="sr-only">{description ?? title}</Dialog.Description>
        <div
          className={cn(
            "pointer-events-none sticky top-0 z-10",
            variant === "full"
              ? "-mb-20 h-20 bg-linear-to-b from-background via-background/90 to-transparent md:mb-0 md:h-0 md:bg-none"
              : "h-0"
          )}
        >
          <Dialog.Close
            aria-label="Fechar"
            className="pointer-events-auto absolute top-5 right-5 flex size-11 items-center justify-center rounded-full border border-line bg-background/80 text-[22px] leading-none text-muted backdrop-blur-sm transition-colors hover:text-foreground md:top-7 md:right-8"
          >
            ×
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </>
  )
}
