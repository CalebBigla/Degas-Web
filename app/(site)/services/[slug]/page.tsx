import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/button-link'
import { CtaBanner } from '@/components/cta-banner'
import { ProjectCard } from '@/components/project-card'
import { RichText } from '@/components/rich-text'
import { JsonLd } from '@/components/json-ld'
import { proseClass } from '@/components/prose'
import { getProjects, getServiceBySlug, getServices, getSettings } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import { getPage } from '@/lib/pages/get'
import {
  breadcrumbSchema,
  buildMetadata,
  jsonLd,
  serviceIsIndexable,
  serviceSchema,
  shareCardUrl,
  snippet,
} from '@/lib/seo'

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

async function load(slug: string) {
  const [service, settings, copy, site] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
    getPage('services'),
    getPage('site'),
  ])
  return { service, settings, copy, site }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { service, settings, site } = await load(slug)
  if (!service) return {}
  return buildMetadata({
    title: service.seoTitle || `${service.title} Services | ${settings.shortName}`,
    description: service.seoDescription || snippet(service.description),
    path: `/services/${service.slug}`,
    image: service.shareImage || shareCardUrl(service.title, site['nav.services']),
    noindex: !serviceIsIndexable(service),
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { service, copy, site } = await load(slug)
  if (!service) notFound()

  const [services, projects] = await Promise.all([getServices(), getProjects()])
  const related = projects.filter((p) => p.serviceIds.includes(service.id)).slice(0, 3)
  const others = services.filter((s) => s.id !== service.id)
  const Icon = getIcon(service.icon)
  const path = `/services/${service.slug}`

  return (
    <>
      <JsonLd
        data={jsonLd(
          breadcrumbSchema([
            { name: site['nav.home'], path: '/' },
            { name: site['nav.services'], path: '/services' },
            { name: service.title, path },
          ]),
          serviceSchema(service, service.seoDescription || snippet(service.description)),
        )}
      />

      <PageHero
        back={{ href: '/services', label: copy['detail.backLabel'] }}
        icon={<Icon className="h-5 w-5" />}
        eyebrow={site['nav.services']}
        title={service.title}
        description={service.description}
      >
        <ButtonLink href="/contact" variant="primary" className="mt-2">
          {copy['detail.ctaLabel']}
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHero>

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-12 lg:col-span-8">
            {service.body && (
              <div className={proseClass}>
                <RichText text={service.body} headings />
              </div>
            )}

            {service.audience && (
              <div>
                <h2 className="text-2xl font-bold text-foreground">{copy['detail.audienceHeading']}</h2>
                <div className={`mt-4 ${proseClass}`}>
                  <RichText text={service.audience} />
                </div>
              </div>
            )}

            {service.included.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground">{copy['list.includedLabel']}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 lift-card">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.faqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground">{copy['detail.faqHeading']}</h2>
                <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
                  {service.faqs.map((faq) => (
                    <details key={faq.question} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                        <h3 className="text-base">{faq.question}</h3>
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className={`mt-3 ${proseClass}`}>
                        <RichText text={faq.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border bg-secondary p-7">
                <p className="font-heading text-lg font-bold text-foreground">{copy['cta.title']}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy['cta.description']}</p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  {copy['detail.ctaLabel']}
                </Link>
              </div>

              {others.length > 0 && (
                <nav aria-label={site['nav.services']} className="rounded-2xl border border-border p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {site['nav.services']}
                  </p>
                  <ul className="mt-4 flex flex-col gap-1">
                    {others.map((other) => (
                      <li key={other.id}>
                        <Link
                          href={`/services/${other.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-md py-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                        >
                          {other.title}
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{copy['detail.workHeading']}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner copy={copy} />
    </>
  )
}
