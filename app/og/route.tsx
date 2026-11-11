import { getSettings } from '@/lib/content'
import { renderShareCard } from '@/lib/og/card'

/**
 * Share card for any page: /og?title=…&label=…
 * Used when a service, case study or article has no share image of its own.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const settings = await getSettings()
  const title = (searchParams.get('title') || settings.tagline).slice(0, 110)
  const label = (searchParams.get('label') || settings.tagline).slice(0, 60)
  const image = renderShareCard({ label, title, footer: settings.name })
  image.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable')
  return image
}
