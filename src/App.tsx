import { lazy, Suspense } from "react"
import { About } from "@/components/About"
import { Contact } from "@/components/Contact"
import { Cursor } from "@/components/Cursor"
import { Education } from "@/components/Education"
import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"
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
            <Galaxy />
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
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
    </div>
  )
}

export default App
