'use client'

import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { THEME_COOKIE, savePreference, type Theme } from '@/lib/admin/preferences'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function root() {
  return document.querySelector<HTMLElement>('.admin-root')
}

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Apply a theme to the admin root, with a brief colour cross-fade. */
export function applyTheme(theme: Theme) {
  const el = root()
  if (!el) return
  el.classList.add('theme-transition')
  el.dataset.theme = theme
  el.classList.toggle('dark', theme === 'dark' || (theme === 'system' && systemDark()))
  savePreference(THEME_COOKIE, theme)
  window.setTimeout(() => el.classList.remove('theme-transition'), 300)
  window.dispatchEvent(new CustomEvent('admin-theme', { detail: theme }))
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const el = root()
    setTheme((el?.dataset.theme as Theme) ?? 'system')
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail)
    window.addEventListener('admin-theme', onChange)

    // Follow the OS while on "system".
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onMedia = () => {
      const current = root()
      if (current?.dataset.theme === 'system') current.classList.toggle('dark', media.matches)
    }
    media.addEventListener('change', onMedia)
    return () => {
      window.removeEventListener('admin-theme', onChange)
      media.removeEventListener('change', onMedia)
    }
  }, [])

  return { theme, setTheme: applyTheme }
}

/** Segmented Light / Dark / System switch with a sliding indicator. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const index = OPTIONS.findIndex((o) => o.value === theme)

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="relative inline-grid grid-cols-3 rounded-lg border border-border bg-secondary/60 p-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-md bg-card shadow-sm ring-1 ring-border transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            compact ? 'h-7 w-8' : 'h-7 px-2.5',
            theme === value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Icon
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-300',
              theme === value && 'rotate-[360deg] scale-110',
            )}
          />
          {!compact && label}
        </button>
      ))}
    </div>
  )
}
