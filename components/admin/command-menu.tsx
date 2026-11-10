'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, ExternalLink, FileText, Moon, Plus, Search, Sun } from 'lucide-react'
import { pageDefinitions, PAGE_SLUGS } from '@/lib/pages/definitions'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/components/admin/nav'
import { applyTheme } from '@/components/admin/theme-toggle'

type Command = {
  id: string
  label: string
  group: string
  icon: React.ComponentType<{ className?: string }>
  hint?: string
  run: () => void
}

/** Ctrl/⌘+K quick navigation. Open it from anywhere with `openCommandMenu()`. */
export function openCommandMenu() {
  window.dispatchEvent(new Event('admin-command-menu'))
}

export function CommandMenu() {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href)
    return [
      ...NAV_ITEMS.map((item) => ({
        id: item.href,
        label: item.label,
        group: 'Go to',
        icon: item.icon,
        run: go(item.href),
      })),
      ...NAV_ITEMS.filter((item) => item.newHref).map((item) => ({
        id: item.newHref!,
        label: `New ${item.label === 'Team' ? 'team member' : item.label.toLowerCase().replace(/s$/, '')}`,
        group: 'Create',
        icon: Plus,
        run: go(item.newHref!),
      })),
      ...PAGE_SLUGS.map((slug) => ({
        id: `page-${slug}`,
        label: `Edit ${pageDefinitions[slug].label}`,
        group: 'Pages',
        icon: FileText,
        hint: pageDefinitions[slug].path ?? 'All pages',
        run: go(`/admin/pages/${slug}`),
      })),
      {
        id: 'theme-light',
        label: 'Switch to light theme',
        group: 'Preferences',
        icon: Sun,
        run: () => applyTheme('light'),
      },
      {
        id: 'theme-dark',
        label: 'Switch to dark theme',
        group: 'Preferences',
        icon: Moon,
        run: () => applyTheme('dark'),
      },
      {
        id: 'view-site',
        label: 'View the live site',
        group: 'Preferences',
        icon: ExternalLink,
        run: () => window.open('/', '_blank', 'noopener'),
      },
    ]
  }, [router])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(q))
  }, [commands, query])

  // Keyboard shortcut + programmatic open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('admin-command-menu', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('admin-command-menu', onOpen)
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (command?: Command) => {
    if (!command) return
    setOpen(false)
    command.run()
  }

  let lastGroup = ''

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === dialogRef.current && setOpen(false)}
      aria-label="Command menu"
      className="mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl open:animate-dialog-in"
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              run(results[active])
            }
          }}
          placeholder="Search pages, content and actions…"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-results"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          className="h-14 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
          ESC
        </kbd>
      </div>

      <ul ref={listRef} id="command-results" role="listbox" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-10 text-center text-sm text-muted-foreground">
            No results for “{query}”
          </li>
        )}
        {results.map((command, index) => {
          const showGroup = command.group !== lastGroup
          lastGroup = command.group
          const Icon = command.icon
          return (
            <li key={command.id} role="presentation">
              {showGroup && (
                <p className="px-3 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 first:pt-1">
                  {command.group}
                </p>
              )}
              <div
                id={`cmd-${command.id}`}
                role="option"
                aria-selected={index === active}
                data-index={index}
                onMouseMove={() => setActive(index)}
                onClick={() => run(command)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  index === active ? 'bg-secondary text-foreground' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors',
                    index === active ? 'border-accent/30 bg-accent/10 text-accent' : 'bg-card',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 truncate font-medium">{command.label}</span>
                {command.hint && <span className="font-mono text-xs text-muted-foreground">{command.hint}</span>}
                {index === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-4 border-t border-border bg-secondary/40 px-4 py-2.5 text-[11px] text-muted-foreground">
        <span><kbd className="font-mono">↑↓</kbd> to move</span>
        <span><kbd className="font-mono">↵</kbd> to open</span>
        <span className="ml-auto"><kbd className="font-mono">Ctrl K</kbd> to toggle</span>
      </div>
    </dialog>
  )
}
