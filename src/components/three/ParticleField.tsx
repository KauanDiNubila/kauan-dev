import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  NormalBlending,
  ShaderMaterial,
  Vector3,
} from "three"
import { createStages } from "@/components/three/shapes"
import { useParticleScroll } from "@/components/three/useParticleScroll"
import { PROJECTS_DWELL_BEFORE, PROJECTS_MORPH_END } from "@/components/Projects"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

type Frame = { x: number; y: number; scale: number; opacity: number }

const DESKTOP: Frame[] = [
  { x: 2.6, y: 0, scale: 0.95, opacity: 1 },
  { x: -2.6, y: 0, scale: 0.85, opacity: 1 },
  { x: 2.75, y: 0, scale: 0.8, opacity: 1 },
  { x: 2.7, y: 0, scale: 0.85, opacity: 1 },
  { x: 2.6, y: 0, scale: 0.8, opacity: 1 },
  { x: 2.7, y: 0, scale: 0.85, opacity: 1 },
  { x: 0, y: 0.95, scale: 0.95, opacity: 1 },
]

const MOBILE: Frame[] = [
  { x: 0, y: 0.9, scale: 0.62, opacity: 0.6 },
  { x: 0, y: 0, scale: 0.55, opacity: 0.3 },
  { x: 0, y: 0, scale: 0.55, opacity: 0.3 },
  { x: 0, y: 0, scale: 0.55, opacity: 0.3 },
  { x: 0, y: -0.3, scale: 0.55, opacity: 0.22 },
  { x: 0, y: 0, scale: 0.5, opacity: 0.3 },
  { x: 0, y: 0.5, scale: 0.55, opacity: 0.9 },
]

const NODE_VERT = `
  attribute float aAlpha;
  attribute float aRandom;
  attribute float aAccent;
  attribute float aIsHub;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float pulse = 1.0 + sin(uTime * 2.2) * 0.1 * aIsHub;
    float size = mix(uSize * (0.55 + aRandom * 0.6), uSize * 2.6 * pulse, aIsHub);
    gl_PointSize = size * uPixelRatio / -mv.z;
    vAlpha = aAlpha;
    vAccent = aAccent;
  }
`

const NODE_FRAG = `
  uniform float uOpacity;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = 1.0 - smoothstep(0.3, 0.5, d);
    gl_FragColor = vec4(mix(uInk, uAccent, vAccent), a * vAlpha * uOpacity);
  }
`

const INK: [number, number, number] = [0.07, 0.07, 0.065]
const ORANGE: [number, number, number] = [0.894, 0.341, 0.055]
const MAX_SEGMENTS = 1100

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
const PINNED_STAGE = 2
const pinnedRemap = (raw: number) =>
  clamp01((raw - PROJECTS_DWELL_BEFORE) / (PROJECTS_MORPH_END - PROJECTS_DWELL_BEFORE))

export const LEXO_SERVICES = [
  "discovery",
  "gateway",
  "auth",
  "cliente",
  "processo",
  "financeiro",
  "auditoria",
  "notificação",
  "ia",
]

type NetworkProps = {
  count: number
  desktop: React.RefObject<boolean>
  labelRefs: React.RefObject<Array<HTMLDivElement | null>>
  lineRefs: React.RefObject<Array<SVGLineElement | null>>
  dotRefs: React.RefObject<Array<SVGCircleElement | null>>
}

function Network({ count, desktop, labelRefs, lineRefs, dotRefs }: NetworkProps) {
  const group = useRef<Group>(null)
  const target = useParticleScroll()
  const material = useRef<ShaderMaterial>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const pixelRatio = useThree((s) => s.viewport.dpr)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const state = useRef({ section: 0, intro: 0, links: 0 })
  const tmp = useRef(new Vector3())

  const { stages, random, accent, lexoHubs } = useMemo(() => createStages(count), [count])
  const positions = useMemo(() => new Float32Array(count * 3), [count])
  const alphas = useMemo(() => new Float32Array(count), [count])
  const hubWeights = useMemo(() => new Float32Array(count), [count])

  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const isHub = new Float32Array(count)
    isHub[0] = 1
    geo.setAttribute("position", new BufferAttribute(positions, 3))
    geo.setAttribute("aAlpha", new BufferAttribute(alphas, 1))
    geo.setAttribute("aRandom", new BufferAttribute(random, 1))
    geo.setAttribute("aAccent", new BufferAttribute(accent, 1))
    geo.setAttribute("aIsHub", new BufferAttribute(isHub, 1))
    return geo
  }, [count, positions, alphas, random, accent])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 34 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uInk: { value: new Color(...INK) },
      uAccent: { value: new Color(...ORANGE) },
    }),
    []
  )

  const line = useMemo(() => {
    const geo = new BufferGeometry()
    geo.setAttribute("position", new BufferAttribute(new Float32Array(MAX_SEGMENTS * 6), 3))
    geo.setAttribute("color", new BufferAttribute(new Float32Array(MAX_SEGMENTS * 8), 4))
    geo.setDrawRange(0, 0)
    const mat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: NormalBlending,
      depthWrite: false,
    })
    return { object: new LineSegments(geo, mat), geo, mat }
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => line.geo.dispose(), [line])
  useEffect(() => () => line.mat.dispose(), [line])

  useEffect(() => {
    const tween = gsap.to(state.current, { intro: 1, duration: reduced ? 0 : 2, ease: "power2.out", delay: 0.2 })
    if (import.meta.env.DEV) Object.assign(window, { __particles: state.current })
    return () => {
      tween.kill()
    }
  }, [reduced])

  const linePos = line.geo.attributes.position as BufferAttribute
  const lineCol = line.geo.attributes.color as BufferAttribute

  useFrame((_, dt) => {
    const g = group.current
    const m = material.current
    if (!g || !m) return
    const c = state.current
    const frames = desktop.current ? DESKTOP : MOBILE

    c.section += (target.current - c.section) * (1 - Math.exp(-dt * 3.2))
    const i = Math.min(Math.floor(c.section), stages.length - 2)
    const raw = clamp01(c.section - i)
    const morph = i === PINNED_STAGE ? pinnedRemap(raw) : raw
    const t = ease(morph)
    const fa = frames[i]
    const fb = frames[i + 1]
    const A = stages[i]
    const B = stages[i + 1]

    const lexoWeight = desktop.current ? (i === 2 ? t : i === 3 ? 1 - t : 0) : 0

    g.position.set(lerp(fa.x, fb.x, t), lerp(fa.y, fb.y, t), 0)
    g.scale.setScalar(lerp(fa.scale, fb.scale, t) * (0.85 + 0.15 * c.intro))
    if (!reduced) {
      g.rotation.y += dt * 0.05 * (1 - lexoWeight)
      g.rotation.x = Math.sin(m.uniforms.uTime.value * 0.12) * 0.08
      m.uniforms.uTime.value += dt
    }
    const groupOpacity = lerp(fa.opacity, fb.opacity, t) * c.intro
    m.uniforms.uOpacity.value = groupOpacity
    m.uniforms.uPixelRatio.value = pixelRatio

    const labels = labelRefs.current
    const lines = lineRefs.current
    const dots = dotRefs.current
    if (labels.length) {
      const labelOpacity = lexoWeight * groupOpacity
      if (labelOpacity < 0.01) {
        for (const el of labels) if (el) el.style.opacity = "0"
        for (const el of lines) if (el) el.setAttribute("opacity", "0")
        for (const el of dots) if (el) el.setAttribute("opacity", "0")
      } else {
        g.updateMatrixWorld()
        tmp.current.set(0, 0, 0).applyMatrix4(g.matrixWorld).project(camera)
        const hx0 = (tmp.current.x * 0.5 + 0.5) * size.width
        const hy0 = (1 - (tmp.current.y * 0.5 + 0.5)) * size.height

        for (let k = 0; k < lexoHubs.length; k++) {
          const el = labels[k]
          const lineEl = lines[k]
          const dotEl = dots[k]
          if (!el) continue
          const [hx, hy, hz] = lexoHubs[k]
          const p = tmp.current.set(hx, hy, hz).applyMatrix4(g.matrixWorld).project(camera)
          if (p.z > 1) {
            el.style.opacity = "0"
            if (lineEl) lineEl.setAttribute("opacity", "0")
            if (dotEl) dotEl.setAttribute("opacity", "0")
            continue
          }
          const ax = (p.x * 0.5 + 0.5) * size.width
          const ay = (1 - (p.y * 0.5 + 0.5)) * size.height
          let dx = ax - hx0
          let dy = ay - hy0
          const dist = Math.hypot(dx, dy) || 1
          dx /= dist
          dy /= dist
          const ex = clamp(ax + dx * 46, 16, size.width - 16)
          const ey = clamp(ay + dy * 46, 96, size.height - 16)

          if (dotEl) {
            dotEl.setAttribute("cx", String(ax))
            dotEl.setAttribute("cy", String(ay))
            dotEl.setAttribute("opacity", String(labelOpacity))
          }
          if (lineEl) {
            lineEl.setAttribute("x1", String(ax))
            lineEl.setAttribute("y1", String(ay))
            lineEl.setAttribute("x2", String(ex))
            lineEl.setAttribute("y2", String(ey))
            lineEl.setAttribute("opacity", String(labelOpacity * 0.55))
          }
          let pointRight = dx >= 0
          if (ex > size.width - 110) pointRight = false
          else if (ex < 110) pointRight = true
          el.style.textAlign = pointRight ? "left" : "right"
          el.style.transform = pointRight
            ? `translate3d(${ex}px, ${ey}px, 0) translate(6px, -50%)`
            : `translate3d(${ex}px, ${ey}px, 0) translate(calc(-100% - 6px), -50%)`
          el.style.opacity = String(labelOpacity)
        }
      }
    }

    for (let n = 0; n < count; n++) {
      const delay = random[n] * 0.35
      const lt = ease(clamp01((morph - delay) / 0.65))
      const o = n * 3
      positions[o] = lerp(A.pos[o], B.pos[o], lt)
      positions[o + 1] = lerp(A.pos[o + 1], B.pos[o + 1], lt)
      positions[o + 2] = lerp(A.pos[o + 2], B.pos[o + 2], lt)
      alphas[n] = lerp(A.alpha[n], B.alpha[n], lt)
      hubWeights[n] = lerp(A.hub[n], B.hub[n], lt)
    }
    ;(geometry.attributes.position as BufferAttribute).needsUpdate = true
    ;(geometry.attributes.aAlpha as BufferAttribute).needsUpdate = true

    let segs = 0
    const push = (
      a: number,
      b: number,
      ca: [number, number, number],
      aa: number,
      cb: [number, number, number],
      ab: number
    ) => {
      const p = segs * 6
      const q = segs * 8
      linePos.array[p] = positions[a * 3]
      linePos.array[p + 1] = positions[a * 3 + 1]
      linePos.array[p + 2] = positions[a * 3 + 2]
      linePos.array[p + 3] = positions[b * 3]
      linePos.array[p + 4] = positions[b * 3 + 1]
      linePos.array[p + 5] = positions[b * 3 + 2]
      lineCol.array[q] = ca[0]
      lineCol.array[q + 1] = ca[1]
      lineCol.array[q + 2] = ca[2]
      lineCol.array[q + 3] = aa
      lineCol.array[q + 4] = cb[0]
      lineCol.array[q + 5] = cb[1]
      lineCol.array[q + 6] = cb[2]
      lineCol.array[q + 7] = ab
      segs++
    }

    for (let n = 1; n < count && segs < MAX_SEGMENTS; n++) {
      const w = hubWeights[n] * alphas[n]
      if (w < 0.05) continue
      push(n, 0, ORANGE, w * 0.15, ORANGE, w * 0.9)
    }

    const link = lerp(A.link, B.link, t)
    const d2 = link * link
    outer: for (let a = 0; a < count && d2 > 0; a++) {
      if (alphas[a] < 0.35) continue
      const ax = positions[a * 3]
      const ay = positions[a * 3 + 1]
      const az = positions[a * 3 + 2]
      for (let b = a + 1; b < count; b++) {
        if (alphas[b] < 0.35) continue
        const dx = ax - positions[b * 3]
        const dy = ay - positions[b * 3 + 1]
        const dz = az - positions[b * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < d2) {
          if (segs >= MAX_SEGMENTS) break outer
          const al = Math.min(alphas[a], alphas[b]) * 0.3
          push(a, b, INK, al, INK, al)
        }
      }
    }

    linePos.needsUpdate = true
    lineCol.needsUpdate = true
    line.geo.setDrawRange(0, segs * 2)
    line.mat.opacity = groupOpacity
    c.links = segs
  })

  return (
    <group ref={group}>
      <primitive object={line.object} />
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={NODE_VERT}
          fragmentShader={NODE_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={NormalBlending}
        />
      </points>
    </group>
  )
}

export default function ParticleField() {
  const query = useMemo(() => window.matchMedia("(min-width: 768px)"), [])
  const desktop = useRef(query.matches)
  const count = useMemo(() => (query.matches ? 261 : 131), [query])
  const labelRefs = useRef<Array<HTMLDivElement | null>>([])
  const lineRefs = useRef<Array<SVGLineElement | null>>([])
  const dotRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => {
      desktop.current = e.matches
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [query])

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <Network count={count} desktop={desktop} labelRefs={labelRefs} lineRefs={lineRefs} dotRefs={dotRefs} />
        </Canvas>
      </div>
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-10 hidden md:block">
        {LEXO_SERVICES.map((name, i) => (
          <line
            key={name}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            stroke="var(--color-primary)"
            strokeWidth="1"
            opacity="0"
          />
        ))}
        {LEXO_SERVICES.map((name, i) => (
          <circle
            key={name}
            ref={(el) => {
              dotRefs.current[i] = el
            }}
            r="2.5"
            fill="var(--color-primary)"
            opacity="0"
          />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-10 hidden md:block">
        {LEXO_SERVICES.map((name, i) => (
          <div
            key={name}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="absolute top-0 left-0 font-mono text-[10px] whitespace-nowrap text-foreground/75 opacity-0"
          >
            {name}
          </div>
        ))}
      </div>
    </>
  )
}
