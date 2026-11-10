'use client'

import { useActionState } from 'react'
import { signIn } from '@/lib/admin/actions'
import { initialFormState } from '@/lib/admin/form'
import { TextField } from '@/components/admin/fields'
import { FormAlert, SubmitButton } from '@/components/admin/form-controls'

export function LoginForm({ notice }: { notice?: string }) {
  const [state, action] = useActionState(signIn, initialFormState)

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.message ? (
        <FormAlert state={state} />
      ) : (
        notice && (
          <p className="rounded-lg border border-border bg-secondary p-3 text-sm text-muted-foreground">
            {notice}
          </p>
        )
      )}
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        defaultValue={state.values?.email}
        required
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
      />
      <SubmitButton pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  )
}
