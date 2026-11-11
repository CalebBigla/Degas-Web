'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/lib/site-data'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function SiteHeader({
  companyName,
  links,
  ctaLabel,
}: {
  companyName: string
  links: NavLink[]
  ctaLabel: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // While the mobile menu is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const onChange = () => query.matches && setOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const closeMenu = () => setOpen(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'border-border bg-background/95'
          : 'border-transparent bg-background',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn('flex items-center gap-2.5 rounded-md', focusRing)}
          aria-label={`${companyName} home`}
        >
          <Logo className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                // Animated underline: grows from the left on hover, stays for the active page.
                "after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-300 after:ease-out after:content-['']",
                focusRing,
                isActive(link.href)
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100',
              )}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className={cn(
              'group hidden items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 md:inline-flex',
              focusRing,
            )}
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden',
              focusRing,
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: always mounted so it can animate; inert (unfocusable) while closed. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <nav
            className={cn(
              'mx-auto flex max-w-6xl flex-col gap-1 border-t border-border bg-background px-4 py-4 transition-transform duration-300 ease-out sm:px-6',
              open ? 'translate-y-0' : '-translate-y-2',
            )}
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  'rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                  focusRing,
                  isActive(link.href)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={closeMenu}
              className={cn(
                'mt-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-accent-foreground',
                focusRing,
              )}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
