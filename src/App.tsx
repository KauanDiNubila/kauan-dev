import { lazy, Suspense } from "react"
import { About } from "@/components/About"
import { Contact } from "@/components/Contact"
import { Cursor } from "@/components/Cursor"
import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { Placeholder } from "@/components/Placeholder"
import { SceneBoundary } from "@/components/three/SceneBoundary"
import { useDesktop } from "@/hooks/useDesktop"

const Galaxy = lazy(() => import("@/components/three/Galaxy"))

function App() {
  const desktop = useDesktop()

  return (
    <div className="relative min-h-screen">
      {desktop ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Galaxy mode="journey" />
          </Suspense>
        </SceneBoundary>
      ) : (
        <div aria-hidden className="starfield" />
      )}
      <div aria-hidden className="grain" />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Placeholder id="projetos" n="02" label="projetos" format="índice com preview" />
        <Placeholder id="skills" n="03" label="skills" format="constelação" />
        <Placeholder id="formacao" n="04" label="formação" format="linha de pontos de luz" />
        <Contact />
      </main>
    </div>
  )
}

export default App
