'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, Copy, Check, Inbox, MailOpen, Trash2 } from 'lucide-react'
import { deleteEnquiry, setEnquiryStatus } from '@/lib/admin/actions'
import type { EnquiryStatus } from '@/lib/admin/queries'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/admin/ui'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

/** Opening an unread enquiry marks it read (and refreshes the sidebar count). */
export function MarkReadOnOpen({ id, status }: { id: string; status: EnquiryStatus }) {
  const router = useRouter()
  const done = useRef(false)
  useEffect(() => {
    if (status !== 'new' || done.current) return
    done.current = true
    void setEnquiryStatus(id, 'read').then(() => router.refresh())
  }, [id, status, router])
  return null
}

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(email).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        })
      }}
      className={cn(buttonClass('ghost'), 'h-9 px-3 text-xs')}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}

/** Mark unread · Archive / Move to inbox · Delete (with confirmation). */
export function EnquiryActions({ id, name, status }: { id: string; name: string; status: EnquiryStatus }) {
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const back = status === 'archived' ? '/admin/enquiries?view=archived' : '/admin/enquiries'

  const run = (next: EnquiryStatus, returnTo: string) =>
    startTransition(async () => {
      await setEnquiryStatus(id, next, returnTo)
    })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== 'archived' && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run('new', '/admin/enquiries')}
          className={cn(buttonClass('secondary'), 'h-9 px-3 text-xs')}
        >
          <MailOpen className="h-3.5 w-3.5" />
          Mark as unread
        </button>
      )}
      {status === 'archived' ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run('read', '/admin/enquiries')}
          className={cn(buttonClass('secondary'), 'h-9 px-3 text-xs')}
        >
          <Inbox className="h-3.5 w-3.5" />
          Move to inbox
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => run('archived', back)}
          className={cn(buttonClass('secondary'), 'h-9 px-3 text-xs')}
        >
          <Archive className="h-3.5 w-3.5" />
          Archive
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(true)}
        className={cn(buttonClass('ghost'), 'h-9 px-3 text-xs hover:bg-destructive/10 hover:text-destructive')}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
      <ConfirmDialog
        open={confirming}
        title={`Delete the enquiry from ${name}?`}
        description="It will be removed permanently. Archive it instead if you might need it later."
        onConfirm={() => startTransition(async () => deleteEnquiry(id))}
        onClose={() => setConfirming(false)}
      />
    </div>
  )
}

