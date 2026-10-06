import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Plane,
  Raycaster,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three"
import { createGalaxy } from "@/components/three/galaxyShape"
import { sampleHands, samplePortrait } from "@/components/three/hands"
import { HERO_STATIC, JOURNEY, sampleJourney, type Keyframe } from "@/components/three/journey"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

const VERT = `
  attribute float aRandom;
  attribute float aSize;
  attribute float aShade;
  attribute vec3 aHand;
  attribute vec3 aPortrait;
  uniform float uTime;
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform vec3 uMouse;
  uniform float uMouseForce;
  uniform float uStretch;
  uniform float uMorph;
  uniform float uHandW;
  uniform float uHandY;
  uniform float uGap;
  uniform float uPortrait;
  uniform vec3 uPortraitCenter;
  uniform float uPortraitH;
  uniform vec3 uCursor;
  varying float vShade;
  varying float vLen;
  varying float vBoost;

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

    vec4 world = modelMatrix * vec4(p, 1.0);
    float mk = clamp(uMorph * 1.6 - aRandom * 0.6, 0.0, 1.0);
    mk = mk * mk * (3.0 - 2.0 * mk);
    vec3 hand = vec3(
      aHand.x * uHandW + aHand.z * uGap,
      aHand.y * uHandW + uHandY + sin(uTime * 0.7 + aHand.x * 6.0) * 0.015,
      (aRandom - 0.5) * 0.12
    );
    world.xyz = mix(world.xyz, hand, mk);

    float pk = clamp(uPortrait * 1.6 - aRandom * 0.6, 0.0, 1.0);
    pk = pk * pk * (3.0 - 2.0 * pk);
    vec3 pp = uPortraitCenter + vec3(aPortrait.xy * uPortraitH, aPortrait.z);
    vec2 cd = pp.xy - uCursor.xy;
    float cdist = length(cd);
    float cf = uCursor.z * smoothstep(0.45, 0.0, cdist);
    cf *= cf;
    pp.xy += (cd / max(cdist, 0.0001)) * cf * 0.14 * (0.5 + aRandom);
    pp.z += cf * (aRandom - 0.5) * 0.6;
    pp.y += sin(uTime * 0.8 + aPortrait.x * 9.0) * 0.006;
    world.xyz = mix(world.xyz, pp, pk);

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    float base = min(aSize * uScale * uPixelRatio / depth, 4.0 * uPixelRatio);
    base = mix(base, (1.1 + aRandom * 0.6) * uPixelRatio, mk);
    base = mix(base, (1.0 + aRandom * 0.6) * uPixelRatio, pk);
    float len = 1.0 + uStretch * (1.0 - pk) * 10.0 * clamp(6.0 / depth, 0.4, 2.0);
    gl_PointSize = min(base * len, 72.0 * uPixelRatio);
    vLen = gl_PointSize / max(base, 0.0001);
    float twinkle = 0.78 + 0.22 * sin(uTime * (1.2 + aRandom * 3.0) + aRandom * 100.0);
    float shade = mix(aShade * twinkle, 0.7 + 0.2 * twinkle, mk);
    shade = mix(shade, 0.72 + 0.2 * twinkle, pk);
    vBoost = pk;
    vShade = shade * k * smoothstep(0.3, 1.8, depth) * mix(1.0, 0.55, uStretch);
  }
`

const FRAG = `
  uniform float uOpacity;
  uniform float uAngle;
  varying float vShade;
  varying float vLen;
  varying float vBoost;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float cs = cos(uAngle);
    float sn = sin(uAngle);
    vec2 r = vec2(c.x * cs - c.y * sn, c.x * sn + c.y * cs);
    float across = r.y * vLen;
    if (r.x * r.x + across * across > 0.25) discard;
    float tail = 1.0 - smoothstep(0.0, 0.5, abs(r.x)) * step(1.5, vLen) * 0.8;
    gl_FragColor = vec4(0.93, 0.93, 0.91, vShade * mix(uOpacity, 0.95, vBoost) * tail);
  }
`

type Mode = "journey" | "static"

const HAND_Y = 0.85
const VISIBLE_HEIGHT = 2 * 9 * Math.tan((25 * Math.PI) / 180)

const anchorOf = (id: string) => {
  if (id === "top") return 0
  const el = document.getElementById(id)
  return el ? el.offsetTop : 0
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
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
  const motion = useRef({ lastY: window.scrollY, stretch: 0, scrollSpin: 0, gap: 0.2 })
  const frame = useRef<Keyframe>({ ...HERO_STATIC, pos: [...HERO_STATIC.pos], rot: [...HERO_STATIC.rot] })

  const geometry = useMemo(() => {
    const g = createGalaxy(count)
    const geo = new BufferGeometry()
    geo.setAttribute("position", new BufferAttribute(g.position, 3))
    geo.setAttribute("aRandom", new BufferAttribute(g.random, 1))
    geo.setAttribute("aSize", new BufferAttribute(g.size, 1))
    geo.setAttribute("aShade", new BufferAttribute(g.shade, 1))
    geo.setAttribute("aHand", new BufferAttribute(new Float32Array(count * 3), 3))
    geo.setAttribute("aPortrait", new BufferAttribute(new Float32Array(count * 3), 3))
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
      uMorph: { value: 0 },
      uHandW: { value: 10 },
      uHandY: { value: HAND_Y },
      uGap: { value: 0.2 },
      uPortrait: { value: 0 },
      uPortraitCenter: { value: new Vector3() },
      uPortraitH: { value: 4 },
      uCursor: { value: new Vector3() },
    }),
    []
  )

  const ray = useMemo(
    () => ({
      caster: new Raycaster(),
      plane: new Plane(),
      normal: new Vector3(),
      hit: new Vector3(),
      origin: new Vector3(),
      gap: new Vector3(),
    }),
    []
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    if (!journey) return
    let cancelled = false
    const fill = (name: string) => (points: Float32Array) => {
      if (cancelled) return
      const attr = geometry.getAttribute(name) as BufferAttribute
      ;(attr.array as Float32Array).set(points)
      attr.needsUpdate = true
    }
    sampleHands(count).then(fill("aHand")).catch(() => {})
    samplePortrait(count).then(fill("aPortrait")).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [count, geometry, journey])

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
    const maxY = document.documentElement.scrollHeight - vh

    const f = journey ? sampleJourney(Math.min(y, maxY), JOURNEY.map((k) => anchorOf(k.id)), vh * 1.1, frame.current) : HERO_STATIC
    t.position.set(f.pos[0], f.pos[1], f.pos[2])
    t.rotation.set(f.rot[0], f.rot[1], f.rot[2])
    t.scale.setScalar(f.scale)
    m.uniforms.uOpacity.value = f.opacity
    m.uniforms.uIntro.value = intro.current.value
    m.uniforms.uPixelRatio.value = pixelRatio
    m.uniforms.uAngle.value = f.rot[2]

    if (!journey) return

    const end = Math.min(anchorOf("contato"), maxY)
    const morph = Math.min(Math.max(1 - (end - y) / (vh * 0.85), 0), 1)
    m.uniforms.uMorph.value = morph
    const aspect = (camera as PerspectiveCamera).aspect
    m.uniforms.uHandW.value = Math.min(VISIBLE_HEIGHT * aspect * 0.98, 15)

    const mo = motion.current
    const velocity = Math.abs(y - mo.lastY) / vh / Math.max(step, 0.001)
    mo.scrollSpin += ((y - mo.lastY) / vh) * 0.35
    mo.lastY = y
    const stretchTarget = reduced ? 0 : Math.min(Math.max(velocity - 0.4, 0) * 0.45, 1) * (1 - morph)
    mo.stretch += (stretchTarget - mo.stretch) * (1 - Math.exp(-step * (stretchTarget > mo.stretch ? 10 : 4)))
    m.uniforms.uStretch.value = mo.stretch

    if (!reduced) m.uniforms.uTime.value += step
    s.rotation.y = -m.uniforms.uTime.value * 0.035 - mo.scrollSpin

    let closeness = 0
    if (pointer.current.inside && morph > 0.9) {
      ray.gap.set(0, HAND_Y, 0).project(camera)
      const dx = ((pointer.current.ndc.x - ray.gap.x) * window.innerWidth) / 2
      const dy = ((pointer.current.ndc.y - ray.gap.y) * vh) / 2
      closeness = 1 - smoothstep(70, 460, Math.hypot(dx, dy))
    }
    const gapTarget = 0.2 * (1 - closeness) - 0.04 * closeness
    mo.gap += (gapTarget - mo.gap) * (1 - Math.exp(-step * 2.5))
    m.uniforms.uGap.value = mo.gap

    const halfH = VISIBLE_HEIGHT / 2
    const halfW = halfH * aspect
    const u = m.uniforms
    const portraitEl = document.querySelector<HTMLElement>("[data-portrait]")
    let portraitTarget = 0
    if (portraitEl) {
      const r = portraitEl.getBoundingClientRect()
      const cy = r.top + r.height / 2
      const cx = r.left + r.width / 2
      u.uPortraitCenter.value.set(((cx / window.innerWidth) * 2 - 1) * halfW, -((cy / vh) * 2 - 1) * halfH, 0)
      u.uPortraitH.value = (r.height / vh) * VISIBLE_HEIGHT
      const section = document.getElementById("sobre")?.getBoundingClientRect()
      if (section && section.top < vh * 0.45 && section.bottom > vh * 0.55) portraitTarget = 1
    }
    u.uPortrait.value += (portraitTarget - u.uPortrait.value) * (1 - Math.exp(-step * (portraitTarget ? 1.6 : 2.4)))
    const cursorOn = pointer.current.inside && u.uPortrait.value > 0.5 ? 1 : 0
    if (pointer.current.inside) u.uCursor.value.set(pointer.current.ndc.x * halfW, pointer.current.ndc.y * halfH, u.uCursor.value.z)
    u.uCursor.value.z += (cursorOn - u.uCursor.value.z) * (1 - Math.exp(-step * 5))

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
