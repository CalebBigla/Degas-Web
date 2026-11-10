/**
 * Crops the empty border around a logo (browser only).
 *
 * Logos are often exported on a large square canvas with lots of white or
 * transparent space, which makes them look tiny when shown at a fixed height.
 * The background colour is taken from the corners; anything that differs from
 * it counts as artwork. Returns a PNG (keeps transparency), at most 1200px wide.
 * SVGs and images that are already tight are returned unchanged.
 */
export async function trimImage(file: File): Promise<File> {
  if (file.type === 'image/svg+xml') return file

  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file

  const { width, height } = bitmap
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0)
  const { data } = ctx.getImageData(0, 0, width, height)

  // Background = average of the four corner pixels.
  const corners = [0, width - 1, (height - 1) * width, height * width - 1]
  const bg = [0, 1, 2, 3].map(
    (c) => corners.reduce((sum, p) => sum + data[p * 4 + c]!, 0) / corners.length,
  )
  const transparentBg = bg[3]! < 16

  const isContent = (i: number) => {
    const alpha = data[i + 3]!
    if (alpha < 16) return false
    if (transparentBg) return true
    const diff =
      Math.abs(data[i]! - bg[0]!) + Math.abs(data[i + 1]! - bg[1]!) + Math.abs(data[i + 2]! - bg[2]!)
    return diff > 48
  }

  let top = height, left = width, right = -1, bottom = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isContent((y * width + x) * 4)) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  if (right < 0) return file // blank image

  // Small breathing room around the artwork.
  const pad = Math.round(Math.max(right - left, bottom - top) * 0.04)
  left = Math.max(0, left - pad)
  top = Math.max(0, top - pad)
  right = Math.min(width - 1, right + pad)
  bottom = Math.min(height - 1, bottom + pad)

  const cropW = right - left + 1
  const cropH = bottom - top + 1
  const alreadyTight = cropW > width * 0.92 && cropH > height * 0.92
  if (alreadyTight && width <= 1200) return file

  const scale = Math.min(1, 1200 / cropW)
  const out = document.createElement('canvas')
  out.width = Math.round(cropW * scale)
  out.height = Math.round(cropH * scale)
  const outCtx = out.getContext('2d')
  if (!outCtx) return file
  outCtx.imageSmoothingQuality = 'high'
  outCtx.drawImage(canvas, left, top, cropW, cropH, 0, 0, out.width, out.height)

  const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, 'image/png'))
  if (!blob) return file
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.png', { type: 'image/png' })
}
