import { Hero } from '@/components/home/hero'
import { ClientMarquee } from '@/components/home/client-marquee'
import { ServicesOverview } from '@/components/home/services-overview'
import { WhyChoose } from '@/components/home/why-choose'
import { HowWeWork } from '@/components/home/how-we-work'
import { FeaturedWork } from '@/components/home/featured-work'
import { CtaBanner } from '@/components/cta-banner'
import type { Metadata } from 'next'
import { getPage } from '@/lib/pages/get'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata, jsonLd, organizationSchema, websiteSchema } from '@/lib/seo'
import { getClients, getCoreValues, getFeaturedProjects, getServices, getSettings } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPage('site')
  return buildMetadata({ title: site['seo.title'], description: site['seo.description'], path: '/' })
}

export default async function HomePage() {
  // Start every query at once instead of after the page copy has loaded.
  void getClients()
  void getServices()
  void getCoreValues()
  void getFeaturedProjects()
  const [copy, settings] = await Promise.all([getPage('home'), getSettings()])
  return (
    <>
      <JsonLd data={jsonLd(organizationSchema(settings), websiteSchema(settings))} />
      <Hero copy={copy} />
      <ClientMarquee heading={copy['clients.heading']} />
      <ServicesOverview copy={copy} />
      <WhyChoose copy={copy} />
      <HowWeWork copy={copy} />
      <FeaturedWork copy={copy} />
      <CtaBanner copy={copy} />
    </>
  )
}
