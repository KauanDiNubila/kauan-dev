function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const FORM_SHARE = 0.14

export function createFormations(count: number) {
  const rand = mulberry32(41)
  const gauss = () => {
    let u = 0
    while (u === 0) u = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
  }
  const astra = new Float32Array(count * 3)
  const lexo = new Float32Array(count * 3)
  const form = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    if (rand() > FORM_SHARE) continue
    form[i] = 1
    const o = i * 3

    const a = rand()
    if (a < 0.34) {
      const r = Math.abs(gauss()) * 0.09
      const th = rand() * Math.PI * 2
      astra[o] = Math.cos(th) * r
      astra[o + 1] = Math.sin(th) * r
    } else if (a < 0.84) {
      const vertical = rand() < 0.55
      const len = vertical ? 1.15 : 1.05
      const t = Math.pow(rand(), 2.4) * len * (rand() < 0.5 ? -1 : 1)
      const spread = gauss() * 0.014 * (1 - Math.abs(t) / len)
      astra[o] = vertical ? spread : t
      astra[o + 1] = vertical ? t : spread
    } else {
      const t = Math.pow(rand(), 2) * 0.42 * (rand() < 0.5 ? -1 : 1)
      const sign = rand() < 0.5 ? -1 : 1
      astra[o] = t * Math.SQRT1_2
      astra[o + 1] = t * Math.SQRT1_2 * sign
    }
    astra[o + 2] = gauss() * 0.03

    const b = rand()
    if (b < 0.14) {
      const r = Math.abs(gauss()) * 0.1
      const th = rand() * Math.PI * 2
      lexo[o] = Math.cos(th) * r
      lexo[o + 1] = Math.sin(th) * r
    } else if (b < 0.8) {
      const k = Math.floor(rand() * 8)
      const ang = (k / 8) * Math.PI * 2
      const r = Math.abs(gauss()) * 0.075
      const th = rand() * Math.PI * 2
      lexo[o] = Math.cos(ang) * 1.15 + Math.cos(th) * r
      lexo[o + 1] = Math.sin(ang) * 1.15 + Math.sin(th) * r
    } else {
      const ang = rand() * Math.PI * 2
      const r = 1.15 + gauss() * 0.012
      lexo[o] = Math.cos(ang) * r
      lexo[o + 1] = Math.sin(ang) * r
    }
    lexo[o + 2] = gauss() * 0.03
  }

  return { astra, lexo, form }
}
