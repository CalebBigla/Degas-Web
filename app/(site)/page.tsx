import { Hero } from '@/components/home/hero'
import { ClientMarquee } from '@/components/home/client-marquee'
import { ServicesOverview } from '@/components/home/services-overview'
import { WhyChoose } from '@/components/home/why-choose'
import { HowWeWork } from '@/components/home/how-we-work'
import { FeaturedWork } from '@/components/home/featured-work'
import { CtaBanner } from '@/components/cta-banner'
import { getPage } from '@/lib/pages/get'
import { getClients, getCoreValues, getFeaturedProjects, getServices } from '@/lib/content'

export default async function HomePage() {
  // Start every query at once instead of after the page copy has loaded.
  void getClients()
  void getServices()
  void getCoreValues()
  void getFeaturedProjects()
  const copy = await getPage('home')
  return (
    <>
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
