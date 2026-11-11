import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const LINKS = [
  { href: '/services', label: 'Our services' },
  { href: '/work', label: 'Case studies' },
  { href: '/contact', label: 'Contact us' },
]

/** Friendly 404 with routes back in to the site. */
export function NotFoundContent() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-accent">Error 404</p>
        <h1 className="mt-4 text-balance text-4xl font-bold text-foreground sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          The link may be old or mistyped. Here are some good places to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Go to the home page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
