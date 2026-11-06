import type { Metadata } from 'next'
import Image from 'next/image'
import { Eye, Target, ExternalLink, ArrowUpRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { coreValues, company, team } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Degas Concepts Limited is a CAC-registered tech solutions company built on transparency, integrity, and reliability — simplifying solutions across the tech space.',
}


function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A trusted partner for tech solutions"
        description="Degas Concepts Limited exists to simplify how organizations adopt and build technology — combining thoughtful design with dependable engineering."
      />

      {/* Origin / overview */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who we are" title="Built to simplify, engineered to last" />
          </div>
          <div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              Degas Concepts Limited — DEsiGn And Softwares — is a CAC-registered
              technology company delivering design and software solutions to businesses
              that value clarity and quality. We bring together a multidisciplinary team
              spanning product design, web, and mobile development.
            </p>
            <p>
              Our approach is simple: understand the problem deeply, design the clearest
              possible solution, and build it reliably. That discipline has allowed us to
              deliver systems across fintech, real estate, enterprise tools, and community
              platforms — each held to the same standard of simplicity and excellence.
            </p>
            <p>
              We measure success by the trust our clients place in us and the dependability
              of what we ship. That is the standard we hold on every engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-y border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-9">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Eye className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {company.vision}
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-9">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <Target className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
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
            eyebrow="Core values"
            title="What we stand for"
            description="Three commitments that shape how we work with every client and on every project."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coreValues.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Our team"
            title="The people behind the work"
            description="A focused team of designers and engineers dedicated to shipping dependable products."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8"
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
                    LinkedIn
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Let's build something reliable together"
        description="Partner with a team that values clarity, honesty, and dependable delivery."
      />
    </>
  )
}
