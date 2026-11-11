import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'
import { getServices } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import { Reveal } from '@/components/reveal'
import { getPage } from '@/lib/pages/get'
import { buildMetadata } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('services')
  return buildMetadata({
    title: copy['seo.title'],
    description: copy['seo.description'],
    path: '/services',
    noindex: copy['seo.noindex'],
  })
}

export default async function ServicesPage() {
  const site = await getPage('site')
  const [services, copy] = await Promise.all([getServices(), getPage('services')])
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: site['nav.services'], path: '/services' }]} />
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {services.map(({ slug, title, description, included, icon }, index) => {
            const Icon = getIcon(icon)
            return (
            <Reveal
              key={slug}
              id={slug}
              className="grid scroll-mt-24 gap-8 rounded-2xl border border-border bg-card p-8 lg:grid-cols-12 lg:p-10"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-navy-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-heading text-sm font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-foreground">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <Link
                  href={`/services/${slug}`}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
                >
                  {copy['list.learnMore']}
                  <span className="sr-only">: {title}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {copy['list.includedLabel']}
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            )
          })}
        </div>
      </section>

      <CtaBanner copy={copy} />
    </>
  )
}
