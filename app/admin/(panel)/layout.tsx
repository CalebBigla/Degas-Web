import { Suspense } from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { AdminShell } from '@/components/admin/admin-shell'
import { SetupRequired } from '@/components/admin/setup-required'
import { StatusToast } from '@/components/admin/status-toast'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupRequired />
  const { user } = await requireAdmin()

  return (
    <AdminShell email={user.email ?? 'Admin'}>
      {children}
      <Suspense fallback={null}>
        <StatusToast />
      </Suspense>
    </AdminShell>
  )
}
