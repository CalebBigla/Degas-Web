import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { CtaBanner } from '@/components/cta-banner'
import { Eyebrow } from '@/components/section-heading'
import { projects } from '@/lib/site-data'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Case Study' }
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  }
}

const highlights = [
  'Clear discovery and scoping before a single line of code',
  'Design system for a consistent, accessible interface',
  'Scalable, well-documented, and maintainable codebase',
  'On-time delivery with ongoing support',
]

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  return (
    <>
      <section className="border-b border-border bg-navy px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-muted transition-colors hover:text-navy-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work
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

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div>
              <h2 className="text-xl font-bold text-foreground">Overview</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                We partnered with the client to design and build the {project.title.toLowerCase()},
                translating complex requirements into a simple, reliable product. Our team
                led the effort end to end — from discovery and design through engineering
                and delivery.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">The approach</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Following our Discover, Design, Build, and Deliver process, we prioritized
                clarity at every stage — ensuring the solution was easy to use, secure, and
                built to scale with the client&apos;s needs.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">What we delivered</h2>
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
              <h3 className="text-sm font-semibold text-foreground">Project details</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-right font-medium text-foreground">{project.category}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-muted-foreground">Services</dt>
                  <dd className="text-right font-medium text-foreground">Design & Development</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-right font-medium text-foreground">On time</dd>
                </div>
              </dl>
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Start a similar project
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
