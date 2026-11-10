'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const MESSAGES: Record<string, { text: string; error?: boolean }> = {
  created: { text: 'Created. It is live on the site now if published.' },
  updated: { text: 'Changes saved and published to the site.' },
  deleted: { text: 'Deleted.' },
  password: { text: 'Password updated.' },
  error: { text: 'Something went wrong. Please try again.', error: true },
}

/** Shows the result of the last action (?status=…), then clears it from the URL. */
export function StatusToast() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const status = params.get('status')
  const [visible, setVisible] = useState<string | null>(null)

  useEffect(() => {
    if (!status || !MESSAGES[status]) return
    setVisible(status)
    router.replace(pathname, { scroll: false })
    const timer = window.setTimeout(() => setVisible(null), 5000)
    return () => window.clearTimeout(timer)
  }, [status, pathname, router])

  if (!visible) return null
  const message = MESSAGES[visible]

  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex max-w-sm animate-pop-in items-start gap-3 rounded-lg border p-4 text-sm shadow-lg motion-reduce:animate-none',
        message.error
          ? 'border-destructive/30 bg-card text-destructive'
          : 'border-accent/30 bg-card text-foreground',
      )}
    >
      {message.error ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      )}
      <span className="flex-1">{message.text}</span>
      <button
        type="button"
        onClick={() => setVisible(null)}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
