import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { THEME_COOKIE, parseTheme } from '@/lib/admin/preferences'
import { cn } from '@/lib/utils'

// Admin pages depend on the signed-in user: never prerender or cache them.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s — Degas Concepts Admin',
  },
  robots: { index: false, follow: false },
}

// Runs before first paint: resolves "system" to light/dark so there is no flash.
const themeScript = `(function(){try{var r=document.currentScript.parentElement;if(r.dataset.theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches){r.classList.add('dark')}}catch(e){}})()`

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value)

  return (
    <div
      className={cn('admin-root min-h-dvh bg-background text-foreground antialiased', theme === 'dark' && 'dark')}
      data-theme={theme}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </div>
  )
}
