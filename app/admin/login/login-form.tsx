'use client'

import { useActionState, useState } from 'react'
import { ArrowRight, Eye, EyeOff, Info } from 'lucide-react'
import { signIn } from '@/lib/admin/actions'
import { initialFormState } from '@/lib/admin/form'
import { cn } from '@/lib/utils'
import { Field, TextField, inputClass } from '@/components/admin/fields'
import { FormAlert, SubmitButton } from '@/components/admin/form-controls'

function PasswordField() {
  const [visible, setVisible] = useState(false)
  return (
    <Field name="password" label="Password">
      <div className="relative">
        <input
          id="password"
          name="password"
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          required
          className={cn(inputClass, 'pr-11')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
        >
          <span className="relative h-4 w-4">
            <Eye
              className={cn(
                'absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200',
                visible ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
              )}
            />
            <EyeOff
              className={cn(
                'absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200',
                visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
              )}
            />
          </span>
        </button>
      </div>
    </Field>
  )
}

export function LoginForm({ notice }: { notice?: string }) {
  const [state, action] = useActionState(signIn, initialFormState)

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.message ? (
        <FormAlert state={state} />
      ) : (
        notice && (
          <p className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/60 p-3.5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            {notice}
          </p>
        )
      )}
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        placeholder="you@company.com"
        defaultValue={state.values?.email}
        required
      />
      <PasswordField />
      <SubmitButton pendingLabel="Signing in…" className="group mt-1 h-11 w-full text-[15px]">
        Sign in
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </SubmitButton>
    </form>
  )
}
