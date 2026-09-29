import { useCallback, useEffect, useRef, useState } from "react"
import { Dialog } from "radix-ui"
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap"
import type { Course, Track } from "@/data/alura"

export type DrawerTrack = Track & { provider: string }

type Props = {
  open: boolean
  tracks: DrawerTrack[]
  opener: React.RefObject<HTMLElement | null>
  onClose: () => void
  period: (courses: Course[]) => string
  byStart: (a: Course, b: Course) => number
  dateLabel: (t: DrawerTrack) => string
}

type PanelProps = Omit<Props, "onClose"> & { onExited: () => void }

function Milestone({
  track,
  period,
  byStart,
  dateLabel,
}: {
  track: DrawerTrack
  period: Props["period"]
  byStart: Props["byStart"]
  dateLabel: Props["dateLabel"]
}) {
  const [open, setOpen] = useState(false)
  const courses = [...track.courses].sort(byStart)
  const single = courses.length === 1 && courses[0].name === track.name
  const panelId = `panel-${track.provider}-${track.name.replace(/\W+/g, "-")}`

  return (
    <li data-drawer-item className="relative pb-7 pl-7 last:pb-1">
      <span
        aria-hidden
        className="absolute top-1.5 left-0 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface"
      />
      <button
        type="button"
        aria-expanded={!single ? open : undefined}
        aria-controls={!single ? panelId : undefined}
        disabled={single}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full flex-col gap-1.5 text-left ${single ? "cursor-default" : "cursor-pointer"}`}
      >
        <div className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-subtle">
          <span className="font-semibold text-primary">{dateLabel(track)}</span>
          <span>·</span>
          <span className="font-semibold text-muted-foreground">{track.provider}</span>
          <span>·</span>
          <span>{track.kind === "trilha" ? "trilha" : "curso"}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 text-[14px] leading-snug font-bold">{track.name}</div>
          <div className="shrink-0 text-right font-mono">
            {track.hours !== undefined && <div className="text-[15px] font-bold text-primary">{track.hours}h</div>}
            <div className="text-[11px] text-subtle">
              {courses.length} {courses.length === 1 ? "curso" : "cursos"}
              {!single && <span className="ml-1.5">{open ? "−" : "+"}</span>}
            </div>
          </div>
        </div>
      </button>
      {!single && (
        <div
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ol className="flex flex-col gap-2.5 pt-3.5">
              {courses.map((course, i) => (
                <li key={course.name} className="flex items-start gap-3 font-mono text-[13px]">
                  <span className="mt-0.5 w-5 shrink-0 text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground/90">{course.name}</div>
                    <div className="mt-0.5 text-[11px] text-subtle">{period([course])}</div>
                  </div>
                  {course.hours !== undefined && (
                    <span className="shrink-0 text-xs text-muted-foreground">{course.hours}h</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </li>
  )
}

export function CourseDrawer({ open, tracks, opener, onClose, period, byStart, dateLabel }: Props) {
  const [mounted, setMounted] = useState(open)
  const exit = useCallback(() => setMounted(false), [])

  if (open && !mounted) setMounted(true)

  if (!mounted) return null

  return (
    <Dialog.Root open onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <DrawerPanel
          open={open}
          tracks={tracks}
          opener={opener}
          onExited={exit}
          period={period}
          byStart={byStart}
          dateLabel={dateLabel}
        />
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function DrawerPanel({ open, tracks, opener, onExited, period, byStart, dateLabel }: PanelProps) {
  const overlay = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    if (!overlay.current || !panel.current) return
    const d = prefersReducedMotion() ? 0.01 : 1
    const desktop = window.matchMedia("(min-width: 768px)").matches

    tl.current = gsap
      .timeline({ paused: true, onReverseComplete: onExited })
      .fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 * d, ease: "power2.out" })
      .fromTo(
        panel.current,
        desktop ? { xPercent: 100 } : { yPercent: 100 },
        { xPercent: 0, yPercent: 0, duration: 0.6 * d, ease: "expo.out" },
        0
      )
      .fromTo(
        panel.current.querySelectorAll("[data-drawer-item]"),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4 * d, stagger: 0.02 * d, ease: "power3.out" },
        0.18 * d
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
      <Dialog.Overlay ref={overlay} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" />
      <Dialog.Content
        ref={panel}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          opener.current?.focus({ preventScroll: true })
        }}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85svh] flex-col rounded-t-2xl border-t border-border bg-surface shadow-[0_-20px_60px_rgba(0,0,0,0.12)] outline-none md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[520px] md:rounded-none md:border-t-0 md:border-l"
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/15 md:hidden" />
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 pt-5 pb-5 md:pt-8">
          <div data-drawer-item className="min-w-0">
            <Dialog.Title className="text-[19px] leading-snug font-bold">Trilhas e cursos</Dialog.Title>
            <Dialog.Description className="mt-1.5 font-mono text-[13px] text-muted-foreground">
              {tracks.length} marcos, em ordem cronológica
            </Dialog.Description>
          </div>
          <Dialog.Close
            aria-label="Fechar"
            className="-mt-1 -mr-2 shrink-0 cursor-pointer rounded p-2 text-lg leading-none text-subtle transition-colors hover:text-foreground"
          >
            ×
          </Dialog.Close>
        </header>

        <div className="orange-scrollbar flex-1 overflow-y-auto overscroll-contain px-6 py-5 [scrollbar-gutter:stable]">
          <div className="relative">
            <div aria-hidden className="absolute top-1.5 bottom-1.5 left-[4.5px] w-px bg-border" />
            <ol className="relative">
              {tracks.map((t) => (
                <Milestone key={`${t.provider}-${t.name}`} track={t} period={period} byStart={byStart} dateLabel={dateLabel} />
              ))}
            </ol>
          </div>
        </div>
      </Dialog.Content>
    </>
  )
}
