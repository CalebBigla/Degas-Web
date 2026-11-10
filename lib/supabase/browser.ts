'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from '@/lib/supabase/config'

let client: ReturnType<typeof createBrowserClient> | undefined

/** Browser client sharing the admin's session cookies (used for image uploads). */
export function getSupabaseBrowserClient() {
  client ??= createBrowserClient(supabaseUrl, supabaseKey)
  return client
}
