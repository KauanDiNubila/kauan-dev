import { cn } from "@/lib/utils"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface/80 backdrop-blur-sm transition-[translate,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
    >
      {children}
    </div>
  )
}
