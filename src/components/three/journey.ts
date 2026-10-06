export type Keyframe = {
  id: string
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
  opacity: number
}

export const JOURNEY: Keyframe[] = [
  { id: "top", pos: [1.5, 0.35, 0], rot: [1.08, 0, -0.42], scale: 1, opacity: 1 },
  { id: "sobre", pos: [5, -0.6, 1], rot: [0.14, 0, -0.32], scale: 2.3, opacity: 0.5 },
  { id: "projetos", pos: [-5, 0.4, 0], rot: [0.1, 0, -0.28], scale: 2.4, opacity: 0.3 },
  { id: "skills", pos: [3, 0.6, 1.5], rot: [-0.12, 0, -0.4], scale: 2.3, opacity: 0.5 },
  { id: "formacao", pos: [-4, -0.3, 1], rot: [0.16, 0, -0.3], scale: 2.3, opacity: 0.45 },
  { id: "contato", pos: [0, 1.2, -4], rot: [1.15, 0, 0.25], scale: 0.55, opacity: 0.95 },
]

export const HERO_STATIC: Keyframe = { id: "top", pos: [0, 1.6, 0], rot: [1.08, 0, -0.42], scale: 0.56, opacity: 1 }

const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function sampleJourney(scrollY: number, anchors: number[], out: Keyframe) {
  let i = 0
  while (i < anchors.length - 2 && scrollY >= anchors[i + 1]) i++
  const span = anchors[i + 1] - anchors[i]
  const t = ease(span > 0 ? Math.min(Math.max((scrollY - anchors[i]) / span, 0), 1) : 1)
  const a = JOURNEY[i]
  const b = JOURNEY[i + 1]
  for (let k = 0; k < 3; k++) {
    out.pos[k] = lerp(a.pos[k], b.pos[k], t)
    out.rot[k] = lerp(a.rot[k], b.rot[k], t)
  }
  out.scale = lerp(a.scale, b.scale, t)
  out.opacity = lerp(a.opacity, b.opacity, t)
  return out
}
