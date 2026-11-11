import Link from 'next/link'
import { Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react'
import type { NavLink } from '@/lib/site-data'
import { getSettings } from '@/lib/content'
import { getPage } from '@/lib/pages/get'
import { Logo } from '@/components/logo'

export async function SiteFooter({ links }: { links: NavLink[] }) {
  const [company, site] = await Promise.all([getSettings(), getPage('site')])
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${company.name} home`}>
              {/* Monochrome (white) logo on the dark footer. */}
              <Logo className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-muted">
              {site['footer.blurb']}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-navy-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {site['footer.badge']}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-navy-foreground">{site['footer.companyHeading']}</h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-muted transition-colors hover:text-navy-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-navy-foreground">{site['footer.contactHeading']}</h3>
            <ul className="mt-4 space-y-3 text-sm text-navy-muted">
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-navy-foreground"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-navy-foreground"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-navy-foreground"
                >
                  <ExternalLink className="h-4 w-4 text-accent" />
                  {site['footer.linkedinLabel']}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-muted sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p>
              &copy; {year} {company.name}. All rights reserved.
            </p>
            <p>
              {site['footer.registration']}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-navy-foreground">
              {site['footer.privacyLabel']}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-navy-foreground">
              {site['footer.termsLabel']}
            </Link>
            {site['footer.slogan'] && <p>{site['footer.slogan']}</p>}
          </div>
        </div>
      </div>
    </footer>
  )
}
