import type { Metadata } from 'next'
import { Phone, Mail, MessageCircle, ShieldCheck, MapPin, Clock, Wallet } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { getSettings } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import { buildMetadata } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPage('contact')
  return buildMetadata({
    title: copy['seo.title'],
    description: copy['seo.description'],
    path: '/contact',
    noindex: copy['seo.noindex'],
  })
}


export default async function ContactPage() {
  const site = await getPage('site')
  const [company, copy] = await Promise.all([getSettings(), getPage('contact')])
  const directContacts = [
    {
      icon: MessageCircle,
      label: copy['direct.whatsappLabel'],
      value: company.phone,
      href: company.whatsapp,
      external: true,
    },
    {
      icon: Mail,
      label: copy['direct.emailLabel'],
      value: company.email,
      href: `mailto:${company.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: copy['direct.callLabel'],
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, '')}`,
      external: false,
    },
  ]

  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: site['nav.contact'], path: '/contact' }]} />
      <PageHero
        eyebrow={copy['hero.eyebrow']}
        title={copy['hero.title']}
        description={copy['hero.description']}
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-10">
              <h2 className="text-xl font-bold text-foreground">{copy['form.title']}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {copy['form.intro']}
              </p>
              <div className="mt-7">
                <ContactForm
                  copy={{
                    name: copy['form.nameLabel'],
                    email: copy['form.emailLabel'],
                    company: copy['form.companyLabel'],
                    optional: copy['form.optionalLabel'],
                    message: copy['form.messageLabel'],
                    submit: copy['form.submitLabel'],
                    sending: copy['form.sendingLabel'],
                    successTitle: copy['form.successTitle'],
                  }}
                />
              </div>
            </div>
          </div>

          {/* Direct contact */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="text-lg font-bold text-foreground">{copy['direct.title']}</h2>
              <ul className="mt-5 space-y-4">
                {directContacts.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="flex items-start gap-3.5 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/40"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {label}
                        </span>
                        <span className="mt-0.5 text-sm font-semibold text-foreground">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent-soft/60 p-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">{copy['trust.title']}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {copy['trust.body']}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6 lift-card">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{copy['location.title']}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {copy['location.body']}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6 lift-card">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{copy['hours.title']}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {company.workingHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6 lift-card">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{copy['payment.title']}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {company.paymentOptions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
