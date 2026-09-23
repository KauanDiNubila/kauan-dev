import { cn } from "@/lib/utils"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-white/40 transition-[translate,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
    >
      {children}
    </div>
  )
}
