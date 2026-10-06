import { useEffect, useMemo, useState } from "react"

export function useDesktop() {
  const query = useMemo(() => window.matchMedia("(min-width: 768px) and (pointer: fine)"), [])
  const [desktop, setDesktop] = useState(query.matches)

  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [query])

  return desktop
}
