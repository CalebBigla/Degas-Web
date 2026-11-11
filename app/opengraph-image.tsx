import { defaultSettings as company } from '@/lib/site-data'
import { OG_SIZE, renderShareCard } from '@/lib/og/card'

export const alt = `${company.name} — We simplify solutions across the tech space`
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderShareCard({
    label: company.tagline,
    title: 'We simplify solutions across the tech space',
    footer: company.name,
  })
}
