import { redirect } from 'next/navigation'
import { cache } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Returns the signed-in admin and a Supabase client bound to their session,
 * or null if nobody is signed in or the user is not on the admin allow-list.
 */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured) return null
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!adminRow) return null

  return { user, supabase }
})

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect('/admin/login?error=unauthorized')
  return admin
}
