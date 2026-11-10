import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  mapClient,
  mapCoreValue,
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

export async function adminSettings() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  return data ? mapSettings(data) : defaultSettings
}
