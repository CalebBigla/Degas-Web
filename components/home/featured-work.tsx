import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { ProjectCard } from '@/components/project-card'
import { getFeaturedProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'

export async function FeaturedWork() {
  const featured = await getFeaturedProjects()
  if (featured.length === 0) return null

  return (
    <section className="border-t border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured work"
            title="Solutions we have delivered"
            description="A selection of systems we have designed and built for teams across industries."
          />
          <a
            href="/work"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            View all work
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
