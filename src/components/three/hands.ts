export const HANDS_GAP = { x: 0.487, y: 0.505 }

async function weights(url: string, gamma: number) {
  const img = new Image()
  img.src = url
  await img.decode()
  const w = img.naturalWidth
  const h = img.naturalHeight
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("2d context unavailable")
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, w, h).data
  const cdf = new Float32Array(w * h)
  let total = 0
  for (let i = 0; i < w * h; i++) {
    const v = data[i * 4] / 255
    total += v > 0.03 ? Math.pow(v, gamma) : 0
    cdf[i] = total
  }
  return { w, h, cdf, total }
}

function pick(cdf: Float32Array, total: number) {
  const target = Math.random() * total
  let lo = 0
  let hi = cdf.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (cdf[mid] < target) lo = mid + 1
    else hi = mid
  }
  return lo
}

export async function sampleHands(count: number, url = "/hands.png") {
  const { w, h, cdf, total } = await weights(url, 2.2)
  const out = new Float32Array(count * 3)
  for (let n = 0; n < count; n++) {
    const i = pick(cdf, total)
    const x = ((i % w) + Math.random()) / w - HANDS_GAP.x
    const y = -((Math.floor(i / w) + Math.random()) / h - HANDS_GAP.y) * (h / w)
    out[n * 3] = x
    out[n * 3 + 1] = y
    out[n * 3 + 2] = x < 0 ? -1 : 1
  }
  return out
}

export async function samplePortrait(count: number, url = "/portrait.png") {
  const { w, h, cdf, total } = await weights(url, 1)
  const out = new Float32Array(count * 3)
  for (let n = 0; n < count; n++) {
    const i = pick(cdf, total)
    out[n * 3] = (((i % w) + Math.random()) / w - 0.5) * (w / h)
    out[n * 3 + 1] = -((Math.floor(i / w) + Math.random()) / h - 0.5)
    out[n * 3 + 2] = (Math.random() - 0.5) * 0.04
  }
  return out
}
