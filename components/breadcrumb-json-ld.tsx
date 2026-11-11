import { JsonLd } from '@/components/json-ld'
import { getPage } from '@/lib/pages/get'
import { breadcrumbSchema, jsonLd, type Crumb } from '@/lib/seo'

/** Breadcrumb structured data: Home › …trail. */
export async function BreadcrumbJsonLd({ trail }: { trail: Crumb[] }) {
  const site = await getPage('site')
  return <JsonLd data={jsonLd(breadcrumbSchema([{ name: site['nav.home'], path: '/' }, ...trail]))} />
}
