import Link from 'next/link'
import { Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react'
import { navLinks, company } from '@/lib/site-data'
import { Logo } from '@/components/logo'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${company.name} home`}>
              <Logo className="h-8 w-8 bg-white/10" />
              <span className="font-heading text-lg font-bold tracking-tight">
                Degas Concepts
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-muted">
              {company.tagline}. A CAC-registered tech solutions company simplifying
              solutions across the tech space.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-navy-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              CAC Registered
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-navy-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
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
            <h3 className="text-sm font-semibold text-navy-foreground">Get in touch</h3>
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
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-muted sm:flex-row sm:items-center">
          <p>
            &copy; {year} {company.name}. All rights reserved.
          </p>
          <p>Simplicity and Excellence.</p>
        </div>
      </div>
    </footer>
  )
}
