import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { CtaBanner } from '@/components/cta-banner'
import { projects } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Case studies from Degas Concepts Limited — KYC verification, real estate management, job portals, payroll, attendance systems, and community apps built with simplicity and excellence.',
}

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Systems we have designed and delivered"
        description="A selection of the products and platforms we have shipped for teams across fintech, real estate, enterprise, and community sectors."
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a project like these?"
        description="We'd love to hear about it. Let's scope it together and give you a clear, honest quote."
      />
    </>
  )
}
