function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const GALAXY_RADIUS = 5.2

export function createGalaxy(count: number) {
  const rand = mulberry32(13)
  const gauss = () => {
    let u = 0
    let v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  const position = new Float32Array(count * 3)
  const random = new Float32Array(count)
  const size = new Float32Array(count)
  const shade = new Float32Array(count)

  const arms = 2
  const spin = 1.15
  const coreCount = Math.floor(count * 0.2)
  const haloCount = Math.floor(count * 0.06)

  for (let i = 0; i < count; i++) {
    const o = i * 3
    random[i] = rand()

    if (i < coreCount) {
      const r = Math.abs(gauss()) * 0.62
      const th = rand() * Math.PI * 2
      position[o] = Math.cos(th) * r
      position[o + 1] = gauss() * 0.22 * Math.max(0.2, 1 - r)
      position[o + 2] = Math.sin(th) * r
      size[i] = 1.4 + rand() * 1.6
      shade[i] = 0.75 + rand() * 0.25
      continue
    }

    if (i < coreCount + haloCount) {
      const r = 1.5 + rand() * GALAXY_RADIUS * 1.6
      const th = rand() * Math.PI * 2
      position[o] = Math.cos(th) * r
      position[o + 1] = gauss() * 0.9
      position[o + 2] = Math.sin(th) * r
      size[i] = 0.8 + rand() * 1.4
      shade[i] = 0.25 + rand() * 0.35
      continue
    }

    const t = Math.pow(rand(), 1.15)
    const r = 0.7 + t * (GALAXY_RADIUS - 0.7)
    const arm = i % arms
    const scatter = (0.18 + t * 0.55) * Math.pow(rand(), 2.2)
    const th = (arm / arms) * Math.PI * 2 + r * spin + (rand() - 0.5) * 0.35
    const dx = (rand() < 0.5 ? -1 : 1) * scatter * r * 0.6
    const dz = (rand() < 0.5 ? -1 : 1) * scatter * r * 0.6
    position[o] = Math.cos(th) * r + dx
    position[o + 1] = gauss() * 0.06 * (1 + t)
    position[o + 2] = Math.sin(th) * r + dz
    size[i] = 0.9 + Math.pow(rand(), 3) * 2.6
    shade[i] = (1 - t * 0.55) * (0.55 + rand() * 0.45)
  }

  return { position, random, size, shade }
}
