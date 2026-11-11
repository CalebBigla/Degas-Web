/**
 * Supabase connection settings. Both are public by design and are sent to the
 * browser anyway: all access control is enforced by row level security
 * (supabase/schema.sql). Never put the *secret* key (sb_secret_…) here.
 *
 * Environment variables override the built-in defaults, e.g. to point a
 * staging site at another project. Supabase calls the key "publishable key"
 * (newer projects) or "anon key".
 */
const DEFAULT_URL = 'https://sdlwvebfyyuvwsjdirtw.supabase.co'
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_9TVrIrWTLzkitmta5baD7Q_GTYPgokg'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

/** Storage bucket for uploaded images. */
export const MEDIA_BUCKET = 'media'
