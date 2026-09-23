import { Nav } from "@/components/Nav"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"
import { Education } from "@/components/Education"
import { Contact } from "@/components/Contact"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </div>
  )
}

export default App
