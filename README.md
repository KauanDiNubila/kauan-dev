# Portfólio · Kauan Di Nubila

Site pessoal de um desenvolvedor back-end Java, com foco em mostrar sistemas que estão no ar: **[kauandinubila.vercel.app](https://kauandinubila.vercel.app)**

Tema escuro e monocromático. O fundo é uma galáxia de partículas que acompanha o scroll: vista de cima no início, atravessada durante as seções, reorganizada num retrato no "sobre" e nas mãos da Criação de Adão no contato (a partir de uma foto de domínio público do afresco).

## Seções

- **Início**: galáxia interativa e apresentação.
- **Sobre**: retrato em partículas, ficha e texto.
- **Projetos**: [Astra](https://github.com/KauanDiNubila/astra) (monólito modular) e [Lexo](https://github.com/KauanDiNubila/lexo-backend) (microsserviços), com caso completo, diagrama de arquitetura interativo e decisões técnicas.
- **Skills**: constelação por categoria, mostrando onde cada tecnologia foi usada.
- **Formação**: faculdade e números de estudo, com as trilhas em uma gaveta.
- **Contato**.

## Stack

| Camada | Tecnologia |
|---|---|
| Base | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS 4, Radix UI, Instrument Serif e Instrument Sans |
| 3D | three.js com React Three Fiber (shaders próprios) |
| Animação | GSAP (ScrollTrigger, SplitText) |
| Deploy | Vercel |

## Rodando localmente

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para gerar a build de produção e checar os tipos:

```bash
npm run build
```
