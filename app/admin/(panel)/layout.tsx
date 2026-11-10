import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin/auth'
import { SIDEBAR_COOKIE } from '@/lib/admin/preferences'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { AdminShell } from '@/components/admin/admin-shell'
import { SetupRequired } from '@/components/admin/setup-required'
import { StatusToast } from '@/components/admin/status-toast'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupRequired />
  const [{ user }, cookieStore] = await Promise.all([requireAdmin(), cookies()])

  return (
    <AdminShell
      email={user.email ?? 'Admin'}
      initialCollapsed={cookieStore.get(SIDEBAR_COOKIE)?.value === 'collapsed'}
    >
      {children}
      <Suspense fallback={null}>
        <StatusToast />
      </Suspense>
    </AdminShell>
  )
}
