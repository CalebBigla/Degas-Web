import type { Metadata } from 'next'
import { Phone, Mail, MessageCircle, ShieldCheck, MapPin, Clock, Wallet } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { getSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contact Degas Concepts Limited — let's build something simple, reliable, and excellent. Reach us by phone, WhatsApp, or email, or request a quote through our contact form.",
}


export default async function ContactPage() {
  const company = await getSettings()
  const directContacts = [
    {
      icon: MessageCircle,
      label: 'Phone / WhatsApp',
      value: company.phone,
      href: company.whatsapp,
      external: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: company.email,
      href: `mailto:${company.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: 'Call us',
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, '')}`,
      external: false,
    },
  ]

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something simple, reliable, and excellent."
        description="Tell us about your project and goals. We'll get back to you with clear next steps and an honest quote."
      />

      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-10">
              <h2 className="text-xl font-bold text-foreground">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form and our team will respond promptly.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Direct contact */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-secondary p-8">
              <h2 className="text-lg font-bold text-foreground">Reach us directly</h2>
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
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
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

            <div className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">CAC Registered Company</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Degas Concepts Limited is a registered Nigerian company. You&apos;re
                  working with a legitimate, accountable team.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Location</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Nigeria — serving clients remotely worldwide. A physical office address
                  can be added here as we grow.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Working hours</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {company.workingHours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-6">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Payment options</p>
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
