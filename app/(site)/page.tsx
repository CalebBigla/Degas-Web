import { Hero } from '@/components/home/hero'
import { ClientMarquee } from '@/components/home/client-marquee'
import { ServicesOverview } from '@/components/home/services-overview'
import { WhyChoose } from '@/components/home/why-choose'
import { HowWeWork } from '@/components/home/how-we-work'
import { FeaturedWork } from '@/components/home/featured-work'
import { CtaBanner } from '@/components/cta-banner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientMarquee />
      <ServicesOverview />
      <WhyChoose />
      <HowWeWork />
      <FeaturedWork />
      <CtaBanner />
    </>
  )
}
