import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { CtaBanner } from '@/components/cta-banner'
import { getProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'
import { getPage } from '@/lib/pages/get'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('work')
  return { title: copy['seo.title'], description: copy['seo.description'] }
}

export default async function WorkPage() {
  const [projects, copy] = await Promise.all([getProjects(), getPage('work')])
  return (
    <>
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 80} className="grid">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner copy={copy} />
    </>
  )
}
