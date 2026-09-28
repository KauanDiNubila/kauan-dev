type Vec3 = [number, number, number]

export type Stage = {
  pos: Float32Array
  alpha: Float32Array
  hub: Float32Array
  link: number
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rotate = ([x, y, z]: Vec3, ax: number, ay: number, az = 0): Vec3 => {
  const y1 = y * Math.cos(ax) - z * Math.sin(ax)
  const z1 = y * Math.sin(ax) + z * Math.cos(ax)
  const x2 = x * Math.cos(ay) + z1 * Math.sin(ay)
  const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay)
  const x3 = x2 * Math.cos(az) - y1 * Math.sin(az)
  const y3 = x2 * Math.sin(az) + y1 * Math.cos(az)
  return [x3, y3, z2]
}

export function createStages(count: number) {
  const rand = mulberry32(7)
  const m = count - 1
  const random = new Float32Array(count)
  const accent = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    random[i] = rand()
    accent[i] = i === 0 || rand() < 0.2 ? 1 : 0
  }

  const unit = (): Vec3 => {
    const u = rand() * 2 - 1
    const th = rand() * Math.PI * 2
    const r = Math.sqrt(1 - u * u)
    return [r * Math.cos(th), u, r * Math.sin(th)]
  }

  const blank = (link: number, hubAlpha: number): Stage => {
    const s: Stage = {
      pos: new Float32Array(count * 3),
      alpha: new Float32Array(count),
      hub: new Float32Array(count),
      link,
    }
    for (let i = 1; i < count; i++) {
      const [x, y, z] = unit()
      s.pos.set([x * 0.15, y * 0.15, z * 0.15], i * 3)
    }
    s.alpha[0] = hubAlpha
    return s
  }

  const put = (s: Stage, i: number, p: Vec3, hub = 0) => {
    s.pos.set(p, i * 3)
    s.alpha[i] = 1
    s.hub[i] = hub
  }

  const hero = blank(0.44, 0)
  for (let i = 1; i < count; i++) {
    const [x, y, z] = unit()
    const r = 2.5 * (0.55 + 0.45 * Math.cbrt(rand()))
    put(hero, i, [x * r, y * r, z * r])
  }

  const coreCount = Math.round(m * 0.22)
  const radii = [1.35, 1.95, 2.55]
  const tilts: Vec3[] = [
    [1.2, 0.2, 0],
    [0.9, -0.6, 0.4],
    [1.45, 0.9, -0.3],
  ]
  const ringTotal = m - coreCount
  const radiusSum = radii.reduce((a, b) => a + b, 0)
  const ringCounts = radii.map((r) => Math.floor((ringTotal * r) / radiusSum))
  ringCounts[2] += ringTotal - ringCounts.reduce((a, b) => a + b, 0)
  const about = blank((2 * Math.PI * radii[0] * 1.3) / ringCounts[0], 1)
  let idx = 1
  for (let k = 0; k < coreCount; k++, idx++) {
    const [x, y, z] = unit()
    const r = 0.55 * Math.cbrt(rand())
    put(about, idx, [x * r, y * r, z * r])
  }
  radii.forEach((radius, ring) => {
    for (let k = 0; k < ringCounts[ring]; k++, idx++) {
      const a = (k / ringCounts[ring]) * Math.PI * 2 + (rand() - 0.5) * 0.05
      const r = radius + (rand() - 0.5) * 0.06
      const [ax, ay, az] = tilts[ring]
      put(about, idx, rotate([Math.cos(a) * r, 0, Math.sin(a) * r], ax, ay, az))
    }
  })

  let a = 10
  while (a > 1 && a * Math.round(a * 1.2) * a > m) a--
  const b = Math.round(a * 1.2)
  const spacing = 2.8 / (b - 1)
  const astra = blank(spacing * 1.15, 0)
  idx = 1
  for (let x = 0; x < a; x++)
    for (let y = 0; y < b; y++)
      for (let z = 0; z < a; z++, idx++) {
        const p: Vec3 = [
          (x - (a - 1) / 2) * spacing + (rand() - 0.5) * 0.02,
          (y - (b - 1) / 2) * spacing + (rand() - 0.5) * 0.02,
          (z - (a - 1) / 2) * spacing + (rand() - 0.5) * 0.02,
        ]
        put(astra, idx, rotate(p, 0.35, 0.6))
      }

  const services = 9
  const clusterSize = Math.max(3, Math.floor((m * 0.62) / services))
  const lexo = blank(0.32 * Math.cbrt(5 / clusterSize), 1)
  const lexoHubs: Vec3[] = []
  idx = 1
  for (let s = 0; s < services; s++) {
    const ang = (s / services) * Math.PI * 2
    const center = rotate([Math.cos(ang) * 2.05, 0, Math.sin(ang) * 2.05], 0.5, 0)
    lexoHubs.push(center)
    for (let k = 0; k < clusterSize; k++, idx++) {
      const [x, y, z] = unit()
      const r = k === 0 ? 0 : 0.32 * Math.cbrt(rand())
      put(lexo, idx, [center[0] + x * r, center[1] + y * r, center[2] + z * r], k === 0 ? 1 : 0)
    }
  }

  const layers = [1.2, 0.4, -0.4, -1.2]
  const perLayer = Math.floor(m / layers.length)
  const rings = perLayer > 40 ? 4 : 3
  const weights = Array.from({ length: rings }, (_, j) => j + 1)
  const weightSum = weights.reduce((x, y) => x + y, 0)
  const layerCounts = weights.map((w) => Math.floor((perLayer * w) / weightSum))
  layerCounts[rings - 1] += perLayer - layerCounts.reduce((x, y) => x + y, 0)
  const skills = blank(1.1 * Math.max((2 * Math.PI * 2) / layerCounts[rings - 1], 2 / rings), 0)
  idx = 1
  layers.forEach((ly) => {
    layerCounts.forEach((cnt, j) => {
      const r = (2 * (j + 1)) / rings
      const offset = rand() * Math.PI * 2
      for (let k = 0; k < cnt; k++, idx++) {
        const ang = offset + (k / cnt) * Math.PI * 2
        put(skills, idx, rotate([Math.cos(ang) * r, ly, Math.sin(ang) * r], 0.28, 0))
      }
    })
  })

  const pathCount = Math.floor(m * 0.5)
  const milestones = 13
  const perMilestone = Math.floor((m - pathCount) / milestones)
  const turns = 1.5
  const helix = (t: number): Vec3 => {
    const ang = t * Math.PI * 2 * turns
    return rotate([Math.cos(ang) * 1.5, -2 + t * 4, Math.sin(ang) * 1.5], 0, 0.3)
  }
  const pathLength = Math.hypot(2 * Math.PI * 1.5 * turns, 4)
  const edu = blank((pathLength / pathCount) * 1.35, 0)
  idx = 1
  for (let k = 0; k < pathCount; k++, idx++) put(edu, idx, helix(k / (pathCount - 1)))
  for (let s = 0; s < milestones; s++) {
    const c = helix((s + 0.5) / milestones)
    for (let k = 0; k < perMilestone; k++, idx++) {
      const [x, y, z] = unit()
      const r = 0.16 * Math.cbrt(rand())
      put(edu, idx, [c[0] + x * r, c[1] + y * r, c[2] + z * r])
    }
  }

  const contact = blank(0, 1)
  const rays = count > 200 ? 16 : 12
  for (let k = 1; k <= rays; k++) {
    const [x, y, z] = unit()
    put(contact, k, [x * 1.05, y * 1.05, z * 1.05], 1)
  }

  return { stages: [hero, about, astra, lexo, skills, edu, contact], random, accent, lexoHubs }
}
