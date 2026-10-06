import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  ShaderMaterial,
} from "three"

const MAX = 24
const HALF_H = 9 * Math.tan((25 * Math.PI) / 180)

const VERT = `
  attribute float aLit;
  uniform float uPixelRatio;
  uniform float uVis;
  varying float vAlpha;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (9.0 + 9.0 * aLit) * uPixelRatio;
    vAlpha = aLit * uVis;
  }
`

const FRAG = `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.16, 0.0, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.35;
    gl_FragColor = vec4(0.95, 0.95, 0.93, (core + glow) * vAlpha);
  }
`

const hash = (n: number) => {
  const s = Math.sin(n * 91.7) * 43758.5453
  return s - Math.floor(s)
}

const spot = (i: number, n: number) => {
  const t = n > 1 ? i / (n - 1) : 0
  return {
    x: 0.6 + t * 0.26 + (hash(i) - 0.5) * 0.07,
    y: 0.82 - t * 0.62 + (hash(i + 50) - 0.5) * 0.05,
  }
}

export function EduStars() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const pixelRatio = useThree((s) => s.viewport.dpr)
  const lit = useRef(new Float32Array(MAX))
  const state = useRef({ vis: 0 })

  const geo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute("position", new BufferAttribute(new Float32Array(MAX * 3), 3))
    g.setAttribute("aLit", new BufferAttribute(new Float32Array(MAX), 1))
    g.setDrawRange(0, 0)
    return g
  }, [])

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uPixelRatio: { value: 1 }, uVis: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    []
  )

  const line = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute("position", new BufferAttribute(new Float32Array(MAX * 6), 3))
    g.setAttribute("color", new BufferAttribute(new Float32Array(MAX * 8), 4))
    g.setDrawRange(0, 0)
    const m = new LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false })
    return { object: new LineSegments(g, m), geo: g, mat: m }
  }, [])

  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
      line.geo.dispose()
      line.mat.dispose()
    },
    [geo, mat, line]
  )

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05)
    const vh = window.innerHeight
    const dots = document.querySelectorAll<HTMLElement>("[data-edu-dot]")
    const n = Math.min(dots.length, MAX)
    const section = document.getElementById("formacao")
    const st = state.current

    let visTarget = 0
    if (section) {
      const r = section.getBoundingClientRect()
      visTarget = r.top < vh * 0.55 && r.bottom > vh * 0.45 ? 1 : 0
    }
    st.vis += (visTarget - st.vis) * (1 - Math.exp(-step * 3))
    mat.uniforms.uVis.value = st.vis
    mat.uniforms.uPixelRatio.value = pixelRatio

    const halfW = HALF_H * camera.aspect
    const pos = geo.getAttribute("position") as BufferAttribute
    const litAttr = geo.getAttribute("aLit") as BufferAttribute
    for (let i = 0; i < n; i++) {
      const reached = dots[i].getBoundingClientRect().top < vh * 0.62 ? 1 : 0
      lit.current[i] += (reached - lit.current[i]) * (1 - Math.exp(-step * (reached ? 4 : 6)))
      const s = spot(i, n)
      pos.setXYZ(i, (s.x * 2 - 1) * halfW, -(s.y * 2 - 1) * HALF_H, 0)
      litAttr.setX(i, lit.current[i])
    }
    pos.needsUpdate = true
    litAttr.needsUpdate = true
    geo.setDrawRange(0, n)

    const lp = line.geo.getAttribute("position") as BufferAttribute
    const lc = line.geo.getAttribute("color") as BufferAttribute
    let segs = 0
    for (let i = 0; i < n - 1; i++) {
      const a = Math.min(lit.current[i], lit.current[i + 1]) * 0.35 * st.vis
      lp.setXYZ(segs * 2, pos.getX(i), pos.getY(i), 0)
      lp.setXYZ(segs * 2 + 1, pos.getX(i + 1), pos.getY(i + 1), 0)
      lc.setXYZW(segs * 2, 0.95, 0.95, 0.93, a)
      lc.setXYZW(segs * 2 + 1, 0.95, 0.95, 0.93, a)
      segs++
    }
    lp.needsUpdate = true
    lc.needsUpdate = true
    line.geo.setDrawRange(0, segs * 2)
  })

  return (
    <group>
      <primitive object={line.object} />
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  )
}
