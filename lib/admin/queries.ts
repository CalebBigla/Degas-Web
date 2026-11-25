import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  mapClient,
  mapCoreValue,
  mapPost,
  mapProject,
  mapService,
  mapSettings,
  mapTeamMember,
} from '@/lib/content-types'
import { defaultSettings } from '@/lib/site-data'

/** Admin reads: include drafts, ordered as shown on the site. */
async function list<T>(table: string, map: (row: Record<string, unknown>) => T) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw new Error(`Could not load ${table}: ${error.message}`)
  return (data ?? []).map(map)
}

async function byId<T>(table: string, id: string, map: (row: Record<string, unknown>) => T) {
  const { supabase } = await requireAdmin()
  // Ids are UUIDs; anything else cannot exist.
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Could not load ${table}: ${error.message}`)
  if (!data) notFound()
  return map(data)
}

export const adminProjects = () => list('projects', mapProject)
export const adminProject = (id: string) => byId('projects', id, mapProject)
export const adminServices = () => list('services', mapService)
export const adminService = (id: string) => byId('services', id, mapService)
export const adminValues = () => list('core_values', mapCoreValue)
export const adminValue = (id: string) => byId('core_values', id, mapCoreValue)
export const adminClients = () => list('clients', mapClient)
export const adminClient = (id: string) => byId('clients', id, mapClient)
export const adminTeam = () => list('team_members', mapTeamMember)
export const adminTeamMember = (id: string) => byId('team_members', id, mapTeamMember)

/** Articles, newest first (drafts included). */
export async function adminPosts() {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: true })
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Could not load posts: ${error.message}. Run supabase/schema.sql again to add the Insights table.`)
  return (data ?? []).map(mapPost)
}
export const adminPost = (id: string) => byId('posts', id, mapPost)

export async function adminSettings() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  return data ? mapSettings(data) : defaultSettings
}

/** Last-saved time of each page (pages never edited are missing). */
export async function adminPageTimestamps(): Promise<Record<string, string>> {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase.from('pages').select('slug, updated_at')
  if (error) throw new Error(`Could not load pages: ${error.message}`)
  return Object.fromEntries((data ?? []).map((row) => [row.slug as string, row.updated_at as string]))
}

/** One page's saved content (raw JSON) and when it was last saved. */
export async function adminPage(slug: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('pages')
    .select('content, updated_at')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(`Could not load page: ${error.message}`)
  const content = data?.content
  return {
    content:
      content && typeof content === 'object' && !Array.isArray(content)
        ? (content as Record<string, unknown>)
        : {},
    updatedAt: (data?.updated_at as string | undefined) ?? null,
  }
}

// -----------------------------------------------------------------------------
// Enquiries (contact form)
// -----------------------------------------------------------------------------

export type EnquiryStatus = 'new' | 'read' | 'archived'

export type Enquiry = {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  status: EnquiryStatus
  source: string | null
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEnquiry = (row: Record<string, any>): Enquiry => ({
  id: row.id,
  name: row.name,
  email: row.email,
  company: row.company ?? null,
  message: row.message,
  status: row.status,
  source: row.source ?? null,
  createdAt: row.created_at,
})

/** True when the error means the enquiries table hasn't been created yet. */
const missingTable = (error: { code?: string } | null) =>
  error?.code === 'PGRST205' || error?.code === '42P01'

/** Inbox (new + read) or archive, newest first. `null` when the table doesn't exist yet. */
export async function adminEnquiries(view: 'inbox' | 'archived'): Promise<Enquiry[] | null> {
  const { supabase } = await requireAdmin()
  let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(500)
  query = view === 'archived' ? query.eq('status', 'archived') : query.neq('status', 'archived')
  const { data, error } = await query
  if (missingTable(error)) return null
  if (error) throw new Error(`Could not load enquiries: ${error.message}`)
  return (data ?? []).map(mapEnquiry)
}

export async function adminEnquiry(id: string): Promise<Enquiry> {
  const { supabase } = await requireAdmin()
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const { data, error } = await supabase.from('enquiries').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Could not load enquiry: ${error.message}`)
  if (!data) notFound()
  return mapEnquiry(data)
}

/** Unread enquiries, for the sidebar badge. 0 if the table doesn't exist yet. */
export async function unreadEnquiryCount(): Promise<number> {
  const { supabase } = await requireAdmin()
  const { count, error } = await supabase
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
  return error ? 0 : (count ?? 0)
}
