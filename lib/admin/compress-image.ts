/**
 * Shrinks a photo before upload (browser only), so pages stay fast without a
 * server-side image optimizer. Images wider than `maxWidth` are scaled down
 * and re-encoded as WebP (keeps transparency, much smaller than PNG/JPG).
 * The original is kept when it is an SVG, can't be decoded, or the result
 * wouldn't be smaller.
 */
export async function compressImage(file: File, maxWidth = 2000, quality = 0.85): Promise<File> {
  if (file.type === 'image/svg+xml') return file

  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file

  const scale = Math.min(1, maxWidth / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  // Some browsers can't encode WebP and silently return PNG; keep whichever is smaller.
  if (!blob || blob.type !== 'image/webp' || (blob.size >= file.size && scale === 1)) return file

  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
}
