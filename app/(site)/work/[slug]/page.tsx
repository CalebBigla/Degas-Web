import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { CtaBanner } from '@/components/cta-banner'
import { Eyebrow } from '@/components/section-heading'
import { getPage } from '@/lib/pages/get'
import { getProjectBySlug, getProjects } from '@/lib/content'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Case Study' }
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    ...(project.coverImage ? { openGraph: { images: [project.coverImage] } } : {}),
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const copy = await getPage('work')
  const overview =
    project.overview || copy['case.defaultOverview'].replaceAll('{title}', project.title)
  const approach = project.approach || copy['case.defaultApproach']
  const highlights =
    project.highlights.length > 0 ? project.highlights : copy['case.defaultHighlights']
  const servicesLabel = project.servicesLabel || copy['case.defaultServices']

  return (
    <>
      <section className="border-b border-border bg-navy px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-muted transition-colors hover:text-navy-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy['case.backLabel']}
          </Link>
          <div className="mt-6 flex flex-col gap-4">
            <Eyebrow>{project.category}</Eyebrow>
            <h1 className="text-balance text-4xl font-bold text-navy-foreground sm:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-navy-muted">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {project.coverImage && (
        <div className="bg-background px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image
              src={project.coverImage}
              alt={`${project.title} screenshot`}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div>
              <h2 className="text-xl font-bold text-foreground">{copy['case.overviewHeading']}</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {overview}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{copy['case.approachHeading']}</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {approach}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{copy['case.highlightsHeading']}</h2>
              <ul className="mt-4 grid gap-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-secondary p-7">
              <h3 className="text-sm font-semibold text-foreground">{copy['case.detailsHeading']}</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">{copy['case.categoryLabel']}</dt>
                  <dd className="text-right font-medium text-foreground">{project.category}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">{copy['case.servicesLabel']}</dt>
                  <dd className="text-right font-medium text-foreground">{servicesLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{copy['case.deliveryLabel']}</dt>
                  <dd className="text-right font-medium text-foreground">{copy['case.deliveryValue']}</dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {copy['case.ctaLabel']}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBanner copy={copy} />
    </>
  )
}
