import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/lib/site-data'

export function ServicesOverview() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What we do"
          title="Services built for reliable outcomes"
          description="A full-stack team covering design, web, mobile, and product — so you can ship complete solutions with a single trusted partner."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, title, summary, icon: Icon }) => (
            <Link
              key={slug}
              href="/services"
              className="group flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-secondary"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-navy-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
