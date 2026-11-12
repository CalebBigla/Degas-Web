'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react'
import { submitContact, type ContactState } from '@/app/(site)/contact/actions'
import { cn } from '@/lib/utils'

const initialState: ContactState = { status: 'idle', message: '' }

export type ContactFormCopy = {
  name: string
  email: string
  company: string
  optional: string
  message: string
  submit: string
  sending: string
  successTitle: string
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-[translate,scale,box-shadow,opacity] duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] active:shadow-sm disabled:pointer-events-none disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? pendingLabel : label}
      {!pending && (
        <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  )
}

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30'

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [state, formAction] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="flex animate-pop-in flex-col items-start gap-3 rounded-xl border border-accent/30 bg-accent-soft/60 p-8 motion-reduce:animate-none"
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">{copy.successTitle}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.status === 'error' && !state.errors && (
        <div className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            {copy.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={cn(fieldClass, state.errors?.name && 'border-destructive')}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? 'name-error' : undefined}
          />
          {state.errors?.name && (
            <p id="name-error" className="text-xs text-destructive">
              {state.errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {copy.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={cn(fieldClass, state.errors?.email && 'border-destructive')}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? 'email-error' : undefined}
          />
          {state.errors?.email && (
            <p id="email-error" className="text-xs text-destructive">
              {state.errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm font-medium text-foreground">
          {copy.company} <span className="text-muted-foreground">{copy.optional}</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {copy.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={cn(fieldClass, 'resize-y', state.errors?.message && 'border-destructive')}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
        />
        {state.errors?.message && (
          <p id="message-error" className="text-xs text-destructive">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from users, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <SubmitButton label={copy.submit} pendingLabel={copy.sending} />
      </div>
    </form>
  )
}
