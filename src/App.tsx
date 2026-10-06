import { Cursor } from "@/components/Cursor"
import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { Placeholder } from "@/components/Placeholder"

function App() {
  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="grain" />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Placeholder id="sobre" n="01" label="sobre" format="ficha" />
        <Placeholder id="projetos" n="02" label="projetos" format="índice com preview" />
        <Placeholder id="skills" n="03" label="skills" format="constelação" />
        <Placeholder id="formacao" n="04" label="formação" format="linha de pontos de luz" />
        <Placeholder id="contato" n="05" label="contato" format="as mãos" />
      </main>
    </div>
  )
}

export default App
