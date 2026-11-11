import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { getServices } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import { Reveal } from '@/components/reveal'
import type { PageContent } from '@/lib/pages/definitions'

export async function ServicesOverview({ copy }: { copy: PageContent<'home'> }) {
  const services = await getServices()
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={copy['services.eyebrow']}
          title={copy['services.title']}
          description={copy['services.description']}
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, title, summary, icon }, index) => {
            const Icon = getIcon(icon)
            return (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="group flex flex-col bg-card p-7 transition-colors hover:bg-secondary"
            >
              <Reveal delay={index * 80} className="flex flex-col gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-navy-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
              </Reveal>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
