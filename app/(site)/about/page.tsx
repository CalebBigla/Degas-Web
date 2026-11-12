import type { Metadata } from 'next'
import Image from 'next/image'
import { Eye, Target, ExternalLink, ArrowUpRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { getCoreValues, getSettings, getTeam } from '@/lib/content'
import { getIcon } from '@/lib/icons'
import { getPage } from '@/lib/pages/get'
import { buildMetadata } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { RichText } from '@/components/rich-text'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('about')
  return buildMetadata({
    title: copy['seo.title'],
    description: copy['seo.description'],
    path: '/about',
    noindex: copy['seo.noindex'],
  })
}


function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export default async function AboutPage() {
  const site = await getPage('site')
  const [company, coreValues, team, copy] = await Promise.all([
    getSettings(),
    getCoreValues(),
    getTeam(),
    getPage('about'),
  ])

  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: site['nav.about'], path: '/about' }]} />
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />

      {/* Origin / overview */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={copy['story.eyebrow']} title={copy['story.title']} />
          </div>
          <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground lg:col-span-7 [&_a]:font-medium [&_a]:text-accent [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            <RichText text={copy['story.body']} />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-y border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-9 lift-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Eye className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-foreground">{copy['vision.title']}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {company.vision}
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-9 lift-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <Target className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-foreground">{copy['mission.title']}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {company.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={copy['values.eyebrow']}
            title={copy['values.title']}
            description={copy['values.description']}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coreValues.map(({ id, title, description, icon }) => {
              const Icon = getIcon(icon)
              return (
              <div
                key={id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8 lift-card"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={copy['team.eyebrow']}
            title={copy['team.title']}
            description={copy['team.description']}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8 lift-card"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-full w-full items-center justify-center bg-navy font-heading text-base font-bold text-white"
                      role="img"
                      aria-label={member.name}
                    >
                      {initials(member.name)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{member.experience}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{member.role}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {copy['team.linkedinLabel']}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner copy={copy} />
    </>
  )
}
