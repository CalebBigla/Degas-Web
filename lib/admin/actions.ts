'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { CONTENT_TAG } from '@/lib/content'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { iconNames } from '@/lib/icons'
import { isPageSlug, pageFields, sanitizeField, type PageValue } from '@/lib/pages/definitions'
import {
  checkbox,
  createValidator,
  invalid,
  lines,
  optionalText,
  SLUG_PATTERN,
  slugify,
  text,
  submittedValues,
  type FormState,
} from '@/lib/admin/form'

// Every list table and the admin page that manages it.
const LIST_TABLES = {
  projects: '/admin/projects',
  services: '/admin/services',
  core_values: '/admin/values',
  clients: '/admin/clients',
  team_members: '/admin/team',
  posts: '/admin/insights',
} as const

type ListTable = keyof typeof LIST_TABLES

function assertListTable(table: string): asserts table is ListTable {
  if (!(table in LIST_TABLES)) throw new Error(`Unknown table: ${table}`)
}

/** Refresh every public page (and the admin) after content changes. */
function refreshSite() {
  updateTag(CONTENT_TAG)
  revalidatePath('/', 'layout')
}

type DbError = { code?: string; message: string } | null

function dbFailure(error: DbError, formData: FormData, slugField = false): FormState {
  if (error?.code === '23505' && slugField) {
    return invalid({ slug: 'This URL slug is already used. Choose another one.' }, formData)
  }
  console.error('[admin] Database error:', error?.message)
  return {
    message: 'Could not save your changes. Please try again.',
    values: submittedValues(formData),
  }
}

async function nextSortOrder(table: ListTable): Promise<number> {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data?.sort_order ?? 0) + 1
}

/** Insert or update, then go back to the list with a status message. */
async function persist(
  table: ListTable,
  id: string | null,
  values: Record<string, unknown>,
  formData: FormData,
  slugField = false,
): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const { error } = id
    ? await supabase.from(table).update(values).eq('id', id)
    : await supabase.from(table).insert({ ...values, sort_order: await nextSortOrder(table) })
  if (error) return dbFailure(error, formData, slugField)

  refreshSite()
  redirect(`${LIST_TABLES[table]}?status=${id ? 'updated' : 'created'}`)
}

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { message: 'Supabase is not configured yet.' }

  const email = text(formData, 'email')
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { message: 'Enter your email and password.' }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) return { message: 'Incorrect email or password.', values: { email } }

  // Signed in, but only allow-listed users may use the admin.
  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()
  if (!adminRow) {
    await supabase.auth.signOut()
    return { message: 'This account does not have admin access.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  const v = createValidator()
  if (password.length < 10) v.add('password', 'Use at least 10 characters.')
  if (password !== confirm) v.add('confirm', 'Passwords do not match.')
  if (!v.ok) return invalid(v.errors, formData)

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { message: error.message }
  redirect('/admin/account?status=password')
}

// -----------------------------------------------------------------------------
// Shared list operations
// -----------------------------------------------------------------------------

export async function deleteItem(table: string, id: string) {
  assertListTable(table)
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    console.error('[admin] Delete failed:', error.message)
    redirect(`${LIST_TABLES[table]}?status=error`)
  }
  refreshSite()
  redirect(`${LIST_TABLES[table]}?status=deleted`)
}

export async function moveItem(table: string, id: string, direction: 'up' | 'down') {
  assertListTable(table)
  const { supabase } = await requireAdmin()
  const { data: rows, error } = await supabase
    .from(table)
    .select('id, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error || !rows) return

  const index = rows.findIndex((row) => row.id === id)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return

  const ordered = [...rows]
  ;[ordered[index], ordered[target]] = [ordered[target], ordered[index]]

  // Renumber 1..n and write only the rows whose position changed.
  await Promise.all(
    ordered.map((row, i) =>
      row.sort_order === i + 1
        ? null
        : supabase.from(table).update({ sort_order: i + 1 }).eq('id', row.id),
    ),
  )
  refreshSite()
}

// -----------------------------------------------------------------------------
// Content
// -----------------------------------------------------------------------------

type Validator = ReturnType<typeof createValidator>

/** The "Search & sharing" card shared by services, projects and articles. */
function seoValues(formData: FormData, v: Validator) {
  const seoTitle = optionalText(formData, 'seo_title')
  const seoDescription = optionalText(formData, 'seo_description')
  const shareImage = optionalText(formData, 'share_image')
  v.maxLength('seo_title', seoTitle, 90, 'SEO title')
  v.maxLength('seo_description', seoDescription, 300, 'Meta description')
  v.image('share_image', shareImage)
  return {
    seo_title: seoTitle,
    seo_description: seoDescription,
    share_image: shareImage,
    noindex: checkbox(formData, 'noindex'),
  }
}

/**
 * FAQs are typed as blocks separated by a blank line: the first line is the
 * question, the rest of the block is the answer.
 */
function parseFaqs(raw: string): { faqs: { question: string; answer: string }[]; error?: string } {
  const blocks = raw
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
  const faqs = blocks.map((block) => {
    const [question = '', ...rest] = block.split('\n')
    return { question: question.trim(), answer: rest.join(' ').trim() }
  })
  const missing = faqs.find((faq) => !faq.answer)
  if (missing) return { faqs, error: `“${missing.question}” needs an answer on the line below it.` }
  if (faqs.length > 20) return { faqs, error: 'Use 20 questions or fewer.' }
  return { faqs }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const title = text(formData, 'title')
  const slug = text(formData, 'slug') || slugify(title)
  const category = text(formData, 'category')
  const description = text(formData, 'description')
  const coverImage = optionalText(formData, 'cover_image')

  const v = createValidator()
  v.require('title', title, 'Title')
  v.require('category', category, 'Category')
  v.require('description', description, 'Short description')
  v.maxLength('description', description, 280, 'Short description')
  if (slug && !SLUG_PATTERN.test(slug))
    v.add('slug', 'Use lowercase letters, numbers and hyphens only.')
  v.image('cover_image', coverImage)
  const seo = seoValues(formData, v)
  if (!v.ok) return invalid(v.errors, formData)

  return persist(
    'projects',
    id,
    {
      title,
      slug,
      category,
      description,
      overview: optionalText(formData, 'overview'),
      approach: optionalText(formData, 'approach'),
      highlights: lines(formData, 'highlights'),
      services_label: optionalText(formData, 'services_label'),
      cover_image: coverImage,
      cover_alt: optionalText(formData, 'cover_alt'),
      results: optionalText(formData, 'results'),
      service_ids: formData.getAll('service_ids').map(String).filter((id) => UUID.test(id)),
      featured: checkbox(formData, 'featured'),
      published: checkbox(formData, 'published'),
      ...seo,
    },
    formData,
    true,
  )
}

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const title = text(formData, 'title')
  const slug = text(formData, 'slug') || slugify(title)
  const icon = text(formData, 'icon')
  const summary = text(formData, 'summary')
  const description = text(formData, 'description')

  const v = createValidator()
  v.require('title', title, 'Title')
  v.require('summary', summary, 'Summary')
  v.maxLength('summary', summary, 160, 'Summary')
  v.require('description', description, 'Description')
  if (slug && !SLUG_PATTERN.test(slug))
    v.add('slug', 'Use lowercase letters, numbers and hyphens only.')
  if (!iconNames.includes(icon as never)) v.add('icon', 'Choose an icon.')
  const { faqs, error: faqError } = parseFaqs(text(formData, 'faqs'))
  if (faqError) v.add('faqs', faqError)
  const seo = seoValues(formData, v)
  if (!v.ok) return invalid(v.errors, formData)

  return persist(
    'services',
    id,
    {
      title,
      slug,
      icon,
      summary,
      description,
      included: lines(formData, 'included'),
      body: text(formData, 'body'),
      audience: text(formData, 'audience'),
      faqs,
      published: checkbox(formData, 'published'),
      ...seo,
    },
    formData,
    true,
  )
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const title = text(formData, 'title')
  const slug = text(formData, 'slug') || slugify(title)
  const excerpt = text(formData, 'excerpt')
  const body = text(formData, 'body')
  const coverImage = optionalText(formData, 'cover_image')
  const coverAlt = optionalText(formData, 'cover_alt')
  const published = checkbox(formData, 'published')
  const date = text(formData, 'published_at')

  const v = createValidator()
  v.require('title', title, 'Title')
  v.require('excerpt', excerpt, 'Summary')
  v.maxLength('excerpt', excerpt, 300, 'Summary')
  v.require('body', body, 'Article')
  if (slug && !SLUG_PATTERN.test(slug))
    v.add('slug', 'Use lowercase letters, numbers and hyphens only.')
  v.image('cover_image', coverImage)
  if (coverImage && !coverAlt) v.add('cover_alt', 'Describe the image for screen readers and Google.')
  if (date && Number.isNaN(Date.parse(date))) v.add('published_at', 'Enter a valid date.')
  const seo = seoValues(formData, v)
  if (!v.ok) return invalid(v.errors, formData)

  // Publishing without a date stamps it with today.
  const publishedAt = date ? new Date(date).toISOString() : published ? new Date().toISOString() : null

  return persist(
    'posts',
    id,
    {
      title,
      slug,
      excerpt,
      body,
      cover_image: coverImage,
      cover_alt: coverAlt,
      author: optionalText(formData, 'author'),
      published_at: publishedAt,
      published,
      ...seo,
    },
    formData,
    true,
  )
}

export async function saveCoreValue(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const title = text(formData, 'title')
  const icon = text(formData, 'icon')
  const description = text(formData, 'description')

  const v = createValidator()
  v.require('title', title, 'Title')
  v.require('description', description, 'Description')
  if (!iconNames.includes(icon as never)) v.add('icon', 'Choose an icon.')
  if (!v.ok) return invalid(v.errors, formData)

  return persist('core_values', id, {
    title,
    icon,
    description,
    published: checkbox(formData, 'published'),
  }, formData)
}

export async function saveClient(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const name = text(formData, 'name')
  const logo = optionalText(formData, 'logo_url')

  const v = createValidator()
  v.require('name', name, 'Client name')
  v.image('logo_url', logo)
  if (!v.ok) return invalid(v.errors, formData)

  return persist('clients', id, {
    name,
    logo_url: logo,
    published: checkbox(formData, 'published'),
  }, formData)
}

export async function saveTeamMember(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = optionalText(formData, 'id')
  const name = text(formData, 'name')
  const role = text(formData, 'role')
  const linkedin = optionalText(formData, 'linkedin')
  const image = optionalText(formData, 'image_url')

  const v = createValidator()
  v.require('name', name, 'Name')
  v.require('role', role, 'Role')
  v.url('linkedin', linkedin, 'LinkedIn')
  v.image('image_url', image)
  if (!v.ok) return invalid(v.errors, formData)

  return persist('team_members', id, {
    name,
    role,
    experience: text(formData, 'experience'),
    bio: text(formData, 'bio'),
    linkedin,
    image_url: image,
    published: checkbox(formData, 'published'),
  }, formData)
}

const SETTINGS_FIELDS = [
  ['name', 'Company name'],
  ['short_name', 'Short name'],
  ['tagline', 'Tagline'],
  ['vision', 'Vision'],
  ['mission', 'Mission'],
  ['phone', 'Phone'],
  ['whatsapp', 'WhatsApp link'],
  ['email', 'Email'],
  ['linkedin', 'LinkedIn'],
  ['rc_number', 'RC number'],
  ['working_hours', 'Working hours'],
  ['payment_options', 'Payment options'],
] as const

const OPTIONAL_SETTINGS_URLS = [
  ['instagram', 'Instagram'],
  ['x_url', 'X (Twitter)'],
  ['facebook', 'Facebook'],
] as const

/** Accepts the bare code or the whole <meta … content="CODE"> tag the console gives you. */
function verificationCode(formData: FormData, name: string): string {
  const raw = text(formData, name)
  return (/content=["']([^"']+)["']/i.exec(raw)?.[1] ?? raw).trim()
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin()

  const v = createValidator()
  const values: Record<string, string> = {}
  for (const [field, label] of SETTINGS_FIELDS) {
    values[field] = text(formData, field)
    v.require(field, values[field], label)
  }
  for (const [field, label] of OPTIONAL_SETTINGS_URLS) {
    values[field] = text(formData, field)
    v.url(field, values[field] || null, label)
  }
  values.address = text(formData, 'address')
  values.google_verification = verificationCode(formData, 'google_verification')
  values.bing_verification = verificationCode(formData, 'bing_verification')
  for (const field of ['google_verification', 'bing_verification'] as const) {
    if (values[field] && !/^[\w-]{6,100}$/.test(values[field]))
      v.add(field, 'Paste the code from the meta tag (letters, numbers, - and _ only).')
  }
  v.url('whatsapp', values.whatsapp, 'WhatsApp link')
  v.url('linkedin', values.linkedin, 'LinkedIn')
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    v.add('email', 'Enter a valid email address.')
  if (!v.ok) return invalid(v.errors, formData)

  const { error } = await supabase.from('site_settings').upsert({ id: 1, ...values })
  if (error) return dbFailure(error, formData)

  refreshSite()
  redirect('/admin/settings?status=updated')
}

// -----------------------------------------------------------------------------
// Page copy
// -----------------------------------------------------------------------------

/** Save the text of one page. The editor posts every field as JSON in `content`. */
export async function savePage(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  if (!isPageSlug(slug)) return { message: 'Unknown page.' }
  const { supabase } = await requireAdmin()

  let submitted: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(String(formData.get('content') ?? '{}'))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    submitted = parsed as Record<string, unknown>
  } catch {
    return { message: 'Could not read the form. Reload the page and try again.' }
  }

  const content: Record<string, PageValue> = {}
  const errors: Record<string, string> = {}

  for (const field of pageFields(slug)) {
    const value = sanitizeField(field, submitted[field.key])
    if (value === undefined) continue
    content[field.key] = value

    if (field.kind === 'group') {
      const items = value as Record<string, string>[]
      const min = field.minItems ?? 0
      if (items.length < min) {
        errors[field.key] = `Add at least ${min} ${field.itemLabel.toLowerCase()}.`
      }
      items.forEach((item, index) => {
        for (const sub of field.fields) {
          if (sub.required && !item[sub.key]) {
            errors[`${field.key}.${index}.${sub.key}`] = `${sub.label} is required.`
          }
        }
      })
    } else if (field.required && typeof value === 'string' && !value) {
      errors[field.key] = `${field.label} is required.`
    }
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Some fields need attention. They are highlighted below.', errors }
  }

  const { error } = await supabase.from('pages').upsert({ slug, content })
  if (error) {
    console.error('[admin] Could not save page:', error.message)
    return { message: 'Could not save your changes. Please try again.' }
  }

  refreshSite()
  redirect(`/admin/pages/${slug}?status=updated`)
}
