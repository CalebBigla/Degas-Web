/**
 * Supabase connection settings. Both are safe to expose to the browser:
 * all access control is enforced by row level security (supabase/schema.sql).
 * Supabase calls the key "publishable key" (newer projects) or "anon key".
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

/** Storage bucket for uploaded images. */
export const MEDIA_BUCKET = 'media'
