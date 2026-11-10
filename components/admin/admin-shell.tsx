'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronRight,
  ChevronsLeft,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  UserCog,
  X,
} from 'lucide-react'
import { signOut } from '@/lib/admin/actions'
import { SIDEBAR_COOKIE, savePreference } from '@/lib/admin/preferences'
import { isPageSlug, pageDefinitions } from '@/lib/pages/definitions'
import { cn } from '@/lib/utils'
import { NAV, NAV_ITEMS, isActivePath } from '@/components/admin/nav'
import { CommandMenu, openCommandMenu } from '@/components/admin/command-menu'
import { ThemeToggle } from '@/components/admin/theme-toggle'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

// -----------------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------------

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className={cn('flex items-center gap-2.5 rounded-lg', focusRing)} aria-label="Dashboard home">
      <span
        className={cn(
          'block overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          collapsed ? 'w-[34px]' : 'w-[118px]',
        )}
      >
        <Image
          src="/logo.png"
          alt="Degas Concepts"
          width={118}
          height={32}
          priority
          className="admin-logo h-8 w-[118px] max-w-none object-contain object-left"
        />
      </span>
    </Link>
  )
}

function Sidebar({
  collapsed,
  onNavigate,
  onToggle,
}: {
  collapsed: boolean
  onNavigate?: () => void
  onToggle?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-border', collapsed ? 'justify-center px-2' : 'justify-between px-5')}>
        <BrandMark collapsed={collapsed} />
        {!collapsed && (
          <span className="rounded-md border border-accent/25 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            Admin
          </span>
        )}
      </div>

      <nav
        className={cn('flex-1 py-4', collapsed ? 'overflow-visible px-3' : 'overflow-y-auto px-3')}
        aria-label="Admin"
      >
        {NAV.map((group, i) => (
          <div key={i} className={cn(i > 0 && 'mt-5')}>
            {group.heading &&
              (collapsed ? (
                <div className="mx-auto mb-3 h-px w-6 bg-border" aria-hidden="true" />
              ) : (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                  {group.heading}
                </p>
              ))}
            <ul className="flex flex-col gap-1">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = isActivePath(pathname, href)
                return (
                  <li key={href} className="group/item relative">
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      aria-label={collapsed ? label : undefined}
                      className={cn(
                        'relative flex h-10 items-center gap-3 rounded-lg text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98]',
                        focusRing,
                        collapsed ? 'justify-center px-0' : 'px-3',
                        active
                          ? 'bg-accent/10 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                      )}
                    >
                      {/* Active indicator bar */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          active ? 'scale-y-100' : 'scale-y-0',
                        )}
                      />
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-[color,transform] duration-200 group-hover/item:scale-110',
                          active && 'text-accent',
                        )}
                      />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </Link>
                    {collapsed && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-within/item:translate-x-0 group-focus-within/item:opacity-100"
                      >
                        {label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {onToggle && (
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}
            className={cn(
              'group/toggle flex h-9 w-full items-center gap-3 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
              focusRing,
              collapsed ? 'justify-center' : 'px-3',
            )}
          >
            <ChevronsLeft
              className={cn(
                'h-[18px] w-[18px] shrink-0 transition-transform duration-300',
                collapsed && 'rotate-180',
              )}
            />
            {!collapsed && (
              <>
                <span>Collapse</span>
                <kbd className="ml-auto rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">
                  Ctrl B
                </kbd>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Top bar
// -----------------------------------------------------------------------------

function useBreadcrumbs() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean).slice(1) // drop "admin"
  const crumbs: { label: string; href?: string }[] = [{ label: 'Dashboard', href: '/admin' }]
  if (parts.length === 0) {
    crumbs.push({ label: 'Overview' })
    return crumbs
  }
  const section = NAV_ITEMS.find((item) => item.href === `/admin/${parts[0]}`)
  if (section) crumbs.push({ label: section.label, href: parts.length > 1 ? section.href : undefined })
  if (parts[1]) {
    const label =
      parts[1] === 'new'
        ? 'New'
        : parts[0] === 'pages' && isPageSlug(parts[1])
          ? pageDefinitions[parts[1]].label
          : 'Edit'
    crumbs.push({ label })
  }
  return crumbs
}

function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-navy text-xs font-bold uppercase text-white shadow-sm ring-2 ring-background transition-transform duration-200 hover:scale-105 active:scale-95',
          focusRing,
        )}
      >
        {email.slice(0, 1)}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-dialog-in rounded-xl border border-border bg-popover p-1.5 shadow-xl"
        >
          <div className="px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate text-sm font-medium text-foreground" title={email}>
              {email}
            </p>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/admin/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <UserCog className="h-4 w-4 text-muted-foreground" />
            Account & password
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            View live site
          </a>
          <div className="my-1 h-px bg-border" />
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function TopBar({ email, onOpenMenu }: { email: string; onOpenMenu: () => void }) {
  const crumbs = useBreadcrumbs()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 lg:px-8',
        scrolled
          ? 'border-border bg-background/80 shadow-[0_1px_0_0_transparent] backdrop-blur-xl'
          : 'border-transparent bg-background',
      )}
    >
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className={cn('-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary lg:hidden', focusRing)}
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <li key={i} className={cn('flex min-w-0 items-center gap-1.5', i < crumbs.length - 2 && 'hidden sm:flex')}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
              {crumb.href ? (
                <Link href={crumb.href} className="truncate text-muted-foreground transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        onClick={openCommandMenu}
        className={cn(
          'group hidden h-9 w-64 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground shadow-sm transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow md:flex',
          focusRing,
        )}
      >
        <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>Search…</span>
        <kbd className="ml-auto rounded-md border border-border bg-secondary px-1.5 font-mono text-[10px]">Ctrl K</kbd>
      </button>
      <button
        type="button"
        onClick={openCommandMenu}
        aria-label="Search"
        className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden', focusRing)}
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      <div className="hidden sm:block">
        <ThemeToggle compact />
      </div>
      <UserMenu email={email} />
    </header>
  )
}

// -----------------------------------------------------------------------------
// Shell
// -----------------------------------------------------------------------------

export function AdminShell({
  email,
  initialCollapsed,
  children,
}: {
  email: string
  initialCollapsed: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  const toggleCollapsed = useCallback(() => {
    setCollapsed((value) => {
      savePreference(SIDEBAR_COOKIE, value ? 'expanded' : 'collapsed')
      return !value
    })
  }, [])

  useEffect(() => setDrawerOpen(false), [pathname])

  // Ctrl/⌘+B toggles the sidebar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleCollapsed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleCollapsed])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div
            className="absolute inset-0 animate-overlay-in bg-navy/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-drawer-in flex-col bg-card shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <Sidebar collapsed={false} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="border-t border-border p-4">
              <ThemeToggle />
            </div>
          </aside>
        </div>
      )}

      <div
        className={cn(
          'transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <TopBar email={email} onOpenMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
      </div>

      <CommandMenu />
    </div>
  )
}
