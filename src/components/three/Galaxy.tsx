import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Plane, Raycaster, ShaderMaterial, Vector2, Vector3 } from "three"
import { createGalaxy } from "@/components/three/galaxyShape"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

const VERT = `
  attribute float aRandom;
  attribute float aSize;
  attribute float aShade;
  uniform float uTime;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform vec3 uMouse;
  uniform float uMouseForce;
  varying float vShade;

  void main() {
    vec3 p = position;
    float k = clamp(uIntro * 1.5 - aRandom * 0.5, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    p = mix(p * 0.04, p, k);
    p.y += sin(uTime * 0.6 + aRandom * 40.0) * 0.02;

    vec2 d = p.xz - uMouse.xz;
    float dist = length(d);
    float f = uMouseForce * smoothstep(1.1, 0.0, dist);
    f *= f;
    p.xz += (d / max(dist, 0.0001)) * f * 0.45;
    p.y += f * 0.6 * (aRandom - 0.5);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale * uPixelRatio / -mv.z;
    float twinkle = 0.78 + 0.22 * sin(uTime * (1.2 + aRandom * 3.0) + aRandom * 100.0);
    vShade = aShade * twinkle * k;
  }
`

const FRAG = `
  uniform float uOpacity;
  varying float vShade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(0.93, 0.93, 0.91, vShade * uOpacity);
  }
`

type Layout = { x: number; y: number; scale: number }

const DESKTOP: Layout = { x: 1.5, y: 0.35, scale: 1 }
const MOBILE: Layout = { x: 0, y: 1.6, scale: 0.56 }

function Field({ count, layout, interactive }: { count: number; layout: Layout; interactive: boolean }) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const material = useRef<ShaderMaterial>(null)
  const { camera, gl, invalidate } = useThree()
  const pixelRatio = useThree((s) => s.viewport.dpr)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const pointer = useRef({ ndc: new Vector2(), inside: false })
  const intro = useRef({ value: interactive && !reduced ? 0 : 1 })

  const geometry = useMemo(() => {
    const g = createGalaxy(count)
    const geo = new BufferGeometry()
    geo.setAttribute("position", new BufferAttribute(g.position, 3))
    geo.setAttribute("aRandom", new BufferAttribute(g.random, 1))
    geo.setAttribute("aSize", new BufferAttribute(g.size, 1))
    geo.setAttribute("aShade", new BufferAttribute(g.shade, 1))
    return geo
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPixelRatio: { value: 1 },
      uScale: { value: 11 },
      uOpacity: { value: 1 },
      uMouse: { value: new Vector3(99, 0, 99) },
      uMouseForce: { value: 0 },
    }),
    []
  )

  const ray = useMemo(
    () => ({ caster: new Raycaster(), plane: new Plane(), normal: new Vector3(), hit: new Vector3(), origin: new Vector3() }),
    []
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    if (intro.current.value === 1) {
      invalidate()
      return
    }
    const tween = gsap.to(intro.current, { value: 1, duration: 2.8, ease: "power2.out", delay: 0.1 })
    return () => {
      tween.kill()
    }
  }, [invalidate])

  useEffect(() => {
    if (!interactive) return
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      pointer.current.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
      pointer.current.inside = e.clientY >= rect.top && e.clientY <= rect.bottom
    }
    const onLeave = () => {
      pointer.current.inside = false
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [gl, interactive])

  useFrame((_, dt) => {
    const t = tilt.current
    const s = spin.current
    const m = material.current
    if (!t || !s || !m) return
    const step = Math.min(dt, 0.05)
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2)

    if (!reduced) {
      s.rotation.y -= step * 0.035
      m.uniforms.uTime.value += step
    }
    t.position.set(layout.x, layout.y + scroll * 0.6, scroll * 2.4)
    t.scale.setScalar(layout.scale)
    m.uniforms.uIntro.value = intro.current.value
    m.uniforms.uOpacity.value = 1 - Math.min(scroll / 0.95, 1)
    m.uniforms.uPixelRatio.value = pixelRatio

    if (!interactive) return
    let target = 0
    if (pointer.current.inside) {
      s.updateMatrixWorld()
      ray.normal.set(0, 1, 0).transformDirection(s.matrixWorld)
      s.getWorldPosition(ray.origin)
      ray.plane.setFromNormalAndCoplanarPoint(ray.normal, ray.origin)
      ray.caster.setFromCamera(pointer.current.ndc, camera)
      if (ray.caster.ray.intersectPlane(ray.plane, ray.hit)) {
        s.worldToLocal(ray.hit)
        m.uniforms.uMouse.value.lerp(ray.hit, 1 - Math.exp(-step * 10))
        target = 1
      }
    }
    m.uniforms.uMouseForce.value += (target - m.uniforms.uMouseForce.value) * (1 - Math.exp(-step * 4))
  })

  return (
    <group ref={tilt} rotation={[1.08, 0, -0.42]}>
      <group ref={spin}>
        <points geometry={geometry} frustumCulled={false}>
          <shaderMaterial
            ref={material}
            vertexShader={VERT}
            fragmentShader={FRAG}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>
    </group>
  )
}

export default function Galaxy() {
  const wrap = useRef<HTMLDivElement>(null)
  const query = useMemo(() => window.matchMedia("(min-width: 768px) and (pointer: fine)"), [])
  const [desktop, setDesktop] = useState(query.matches)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [query])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas
        key={desktop ? "d" : "m"}
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 2]}
        frameloop={desktop ? (visible ? "always" : "never") : "demand"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Field count={desktop ? 26000 : 9000} layout={desktop ? DESKTOP : MOBILE} interactive={desktop} />
      </Canvas>
    </div>
  )
}
