import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getAdmin } from '@/lib/admin/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { SetupRequired } from '@/components/admin/setup-required'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (!isSupabaseConfigured) return <SetupRequired />
  if (await getAdmin()) redirect('/admin')

  const { error } = await searchParams
  const notice =
    error === 'unauthorized'
      ? 'Your session has ended or this account does not have admin access. Please sign in.'
      : undefined

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Degas Concepts" width={160} height={44} className="h-10 w-auto" priority />
          <h1 className="mt-6 text-xl font-bold text-foreground">Sign in to the dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the content of degasconcepts.com</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <LoginForm notice={notice} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Access is limited to approved administrators.
        </p>
      </div>
    </div>
  )
}
