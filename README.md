# Portfólio · Kauan Di Nubila

Site pessoal de um desenvolvedor back-end Java, com foco em mostrar sistemas que estão no ar: **[kauan-dev-puce.vercel.app](https://kauan-dev-puce.vercel.app)**

O fundo é uma cena 3D de partículas que se reorganiza a cada seção, sempre em uma forma que espelha o conteúdo: uma nuvem no início, um núcleo com órbitas em "sobre", um monólito em treliça para o Astra, clusters ligados por um gateway para o Lexo, camadas para as skills e uma espiral para a formação.

## Seções

- **Início**: apresentação e links.
- **Sobre**: quem sou e o que construo.
- **Projetos**: [Astra](https://github.com/KauanDiNubila/astra) (monólito modular) e [Lexo](https://github.com/KauanDiNubila/lexo-backend) (microsserviços), ambos em produção.
- **Skills**: agrupadas por categoria.
- **Formação**: trilhas concluídas, com resumo na página e detalhes em uma gaveta.
- **Contato**.

## Stack

| Camada | Tecnologia |
|---|---|
| Base | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS 4, shadcn/ui (Radix), fonte Geist |
| 3D | three.js com React Three Fiber |
| Animação | GSAP, Framer Motion |
| Deploy | Vercel |

## Rodando localmente

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O site sobe em `http://localhost:5173`. Para gerar a build de produção e checar os tipos:

```bash
npm run build
```

## Decisões de design

- **Tema claro com acento laranja** (`#E4570E`), sem o azul padrão de template.
- **Movimento com sentido**: cada forma 3D representa o conteúdo da seção em que aparece, em vez de trocar de forma sem lógica.
- Animações respeitam `prefers-reduced-motion`.
