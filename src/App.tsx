import { lazy, Suspense } from "react"
import { Nav } from "@/components/Nav"
import { ScrollIndicator } from "@/components/ScrollIndicator"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"
import { Education } from "@/components/Education"
import { Contact } from "@/components/Contact"
import { SceneBoundary } from "@/components/three/SceneBoundary"

const ParticleField = lazy(() => import("@/components/three/ParticleField"))

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SceneBoundary>
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </SceneBoundary>
      <Nav />
      <ScrollIndicator />
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
