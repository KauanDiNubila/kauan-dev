import { cn } from "@/lib/utils"

export function Star({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="-50 -50 100 100"
      className={cn("pointer-events-none motion-safe:animate-[twinkle_4.5s_ease-in-out_infinite]", className)}
    >
      <defs>
        <radialGradient id="star-glow">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="star-v" x1="0" y1="-50" x2="0" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="star-h" x1="-50" y1="0" x2="50" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle r="22" fill="url(#star-glow)" />
      <path d="M0 -48 L1.4 0 L0 48 L-1.4 0 Z" fill="url(#star-v)" />
      <path d="M-34 0 L0 -1.2 L34 0 L0 1.2 Z" fill="url(#star-h)" />
      <path d="M0 -16 L0.8 0 L0 16 L-0.8 0 Z" fill="url(#star-v)" transform="rotate(45)" opacity="0.6" />
      <path d="M0 -16 L0.8 0 L0 16 L-0.8 0 Z" fill="url(#star-v)" transform="rotate(-45)" opacity="0.6" />
      <circle r="2.6" fill="#fff" />
    </svg>
  )
}
