import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { FileText, ImageIcon, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { getAdmin } from '@/lib/admin/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { SetupRequired } from '@/components/admin/setup-required'
import { ThemeToggle } from '@/components/admin/theme-toggle'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Sign in' }

const FEATURES = [
  { icon: FileText, text: 'Edit every page, heading and button on the site' },
  { icon: LayoutDashboard, text: 'Manage projects, services, clients and team' },
  { icon: ImageIcon, text: 'Upload cover images, logos and photos' },
]

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
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-[oklch(0.19_0.04_262)] p-12 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[oklch(0.63_0.13_163)] opacity-25 blur-[120px] motion-safe:animate-pulse"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[oklch(0.55_0.15_262)] opacity-30 blur-[100px]"
        />

        <Image
          src="/logo.png"
          alt="Degas Concepts"
          width={150}
          height={41}
          className="relative h-9 w-auto self-start brightness-0 invert"
          priority
        />

        <div className="relative mt-auto max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[oklch(0.78_0.12_163)]">
            Content studio
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight">
            Simplicity and excellence, from the inside too.
          </h2>
          <ul className="mt-10 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <li
                key={text}
                className="flex animate-rise items-center gap-3 text-sm text-white/80"
                style={{ animationDelay: `${200 + i * 90}ms` }}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                  <Icon className="h-4 w-4 text-[oklch(0.78_0.12_163)]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-16 flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-3.5 w-3.5" />
          Access is limited to approved administrators.
        </p>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="Degas Concepts"
            width={120}
            height={33}
            className="admin-logo h-8 w-auto lg:invisible"
            priority
          />
          <ThemeToggle compact />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="animate-rise">
            <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage the content of degasconcepts.com.
            </p>
          </div>
          <div className="mt-8 animate-rise [animation-delay:80ms]">
            <LoginForm notice={notice} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground lg:hidden">
          Access is limited to approved administrators.
        </p>
      </main>
    </div>
  )
}
