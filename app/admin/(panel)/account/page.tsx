import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { Card, PageHeader } from '@/components/admin/ui'
import { PasswordForm } from '@/components/admin/forms/password-form'

export const metadata: Metadata = { title: 'Account' }

export default async function AccountPage() {
  const { user } = await requireAdmin()
  return (
    <div className="max-w-2xl">
      <PageHeader title="Account" description="Your sign-in details." />
      <div className="flex flex-col gap-6">
        <Card title="Signed in as">
          <p className="text-sm font-medium text-foreground">{user.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            To add or remove administrators, follow the steps in supabase/README.md.
          </p>
        </Card>
        <Card title="Change password">
          <PasswordForm />
        </Card>
      </div>
    </div>
  )
}
