import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Plane, Raycaster, ShaderMaterial, Vector2, Vector3 } from "three"
import { createGalaxy } from "@/components/three/galaxyShape"
import { HERO_STATIC, JOURNEY, sampleJourney, type Keyframe } from "@/components/three/journey"
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
  uniform float uStretch;
  varying float vShade;
  varying float vLen;

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
    float depth = -mv.z;
    float base = min(aSize * uScale * uPixelRatio / depth, 4.0 * uPixelRatio);
    float len = 1.0 + uStretch * 10.0 * clamp(6.0 / depth, 0.4, 2.0);
    gl_PointSize = min(base * len, 72.0 * uPixelRatio);
    vLen = gl_PointSize / max(base, 0.0001);
    float twinkle = 0.78 + 0.22 * sin(uTime * (1.2 + aRandom * 3.0) + aRandom * 100.0);
    vShade = aShade * twinkle * k * smoothstep(0.3, 1.8, depth) * mix(1.0, 0.55, uStretch);
  }
`

const FRAG = `
  uniform float uOpacity;
  uniform float uAngle;
  varying float vShade;
  varying float vLen;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float cs = cos(uAngle);
    float sn = sin(uAngle);
    vec2 r = vec2(c.x * cs - c.y * sn, c.x * sn + c.y * cs);
    float across = r.y * vLen;
    if (r.x * r.x + across * across > 0.25) discard;
    float tail = 1.0 - smoothstep(0.0, 0.5, abs(r.x)) * step(1.5, vLen) * 0.8;
    gl_FragColor = vec4(0.93, 0.93, 0.91, vShade * uOpacity * tail);
  }
`

type Mode = "journey" | "static"

const anchorOf = (id: string) => {
  if (id === "top") return 0
  const el = document.getElementById(id)
  return el ? el.offsetTop : 0
}

function Field({ count, mode }: { count: number; mode: Mode }) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const material = useRef<ShaderMaterial>(null)
  const { camera, invalidate } = useThree()
  const pixelRatio = useThree((s) => s.viewport.dpr)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const journey = mode === "journey"
  const pointer = useRef({ ndc: new Vector2(), inside: false })
  const intro = useRef({ value: journey && !reduced ? 0 : 1 })
  const motion = useRef({ lastY: window.scrollY, stretch: 0, scrollSpin: 0 })
  const frame = useRef<Keyframe>({ ...HERO_STATIC, pos: [...HERO_STATIC.pos], rot: [...HERO_STATIC.rot] })

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
      uStretch: { value: 0 },
      uAngle: { value: 0 },
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
    if (!journey) return
    const onMove = (e: PointerEvent) => {
      pointer.current.ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      pointer.current.inside = true
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
  }, [journey])

  useFrame((_, dt) => {
    const t = tilt.current
    const s = spin.current
    const m = material.current
    if (!t || !s || !m) return
    const step = Math.min(dt, 0.05)
    const vh = window.innerHeight
    const y = window.scrollY

    const f = journey
      ? sampleJourney(Math.min(y, document.documentElement.scrollHeight - vh), JOURNEY.map((k) => anchorOf(k.id)), frame.current)
      : HERO_STATIC
    t.position.set(f.pos[0], f.pos[1], f.pos[2])
    t.rotation.set(f.rot[0], f.rot[1], f.rot[2])
    t.scale.setScalar(f.scale)
    m.uniforms.uOpacity.value = f.opacity
    m.uniforms.uIntro.value = intro.current.value
    m.uniforms.uPixelRatio.value = pixelRatio
    m.uniforms.uAngle.value = f.rot[2]

    if (!journey) return

    const mo = motion.current
    const velocity = Math.abs(y - mo.lastY) / vh / Math.max(step, 0.001)
    mo.scrollSpin += (y - mo.lastY) / vh * 0.35
    mo.lastY = y
    const stretchTarget = reduced ? 0 : Math.min(Math.max(velocity - 0.4, 0) * 0.45, 1)
    mo.stretch += (stretchTarget - mo.stretch) * (1 - Math.exp(-step * (stretchTarget > mo.stretch ? 10 : 4)))
    m.uniforms.uStretch.value = mo.stretch

    if (!reduced) m.uniforms.uTime.value += step
    s.rotation.y = -m.uniforms.uTime.value * 0.035 - mo.scrollSpin

    const heroWeight = 1 - Math.min(y / vh, 1)
    let target = 0
    if (pointer.current.inside && heroWeight > 0) {
      s.updateMatrixWorld()
      ray.normal.set(0, 1, 0).transformDirection(s.matrixWorld)
      s.getWorldPosition(ray.origin)
      ray.plane.setFromNormalAndCoplanarPoint(ray.normal, ray.origin)
      ray.caster.setFromCamera(pointer.current.ndc, camera)
      if (ray.caster.ray.intersectPlane(ray.plane, ray.hit)) {
        s.worldToLocal(ray.hit)
        m.uniforms.uMouse.value.lerp(ray.hit, 1 - Math.exp(-step * 10))
        target = heroWeight
      }
    }
    m.uniforms.uMouseForce.value += (target - m.uniforms.uMouseForce.value) * (1 - Math.exp(-step * 4))
  })

  return (
    <group ref={tilt}>
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

export default function Galaxy({ mode }: { mode: Mode }) {
  const journey = mode === "journey"

  return (
    <div aria-hidden className={`pointer-events-none inset-0 ${journey ? "fixed z-0" : "absolute"}`}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 2]}
        frameloop={journey ? "always" : "demand"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Field count={journey ? 26000 : 9000} mode={mode} />
      </Canvas>
    </div>
  )
}
