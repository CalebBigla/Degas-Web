import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { ProjectCard } from '@/components/project-card'
import { getFeaturedProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'
import type { PageContent } from '@/lib/pages/definitions'

export async function FeaturedWork({ copy }: { copy: PageContent<'home'> }) {
  const featured = await getFeaturedProjects()
  if (featured.length === 0) return null

  return (
    <section className="border-t border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={copy['work.eyebrow']}
            title={copy['work.title']}
            description={copy['work.description']}
          />
          <a
            href="/work"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            {copy['work.linkLabel']}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80} className="grid">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
