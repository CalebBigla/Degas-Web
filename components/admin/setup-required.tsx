import { Database } from 'lucide-react'

/** Shown in place of the admin until Supabase environment variables are set. */
export function SetupRequired() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-navy-foreground">
          <Database className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-xl font-bold text-foreground">Connect the database</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The admin dashboard needs a Supabase project. Until it is connected, the public
          site shows its built-in content.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
          <li>Create a free project at supabase.com.</li>
          <li>
            In the SQL editor, run <code className="rounded bg-secondary px-1">supabase/schema.sql</code>{' '}
            then <code className="rounded bg-secondary px-1">supabase/seed.sql</code>.
          </li>
          <li>
            Set <code className="rounded bg-secondary px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-secondary px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{' '}
            <code className="rounded bg-secondary px-1">.env.local</code> and in Vercel.
          </li>
          <li>Create your admin user and add it to the admins table.</li>
        </ol>
        <p className="mt-6 text-xs text-muted-foreground">
          Full steps are in <code className="rounded bg-secondary px-1">supabase/README.md</code>.
        </p>
      </div>
    </div>
  )
}
