'use server'

import { revalidatePath } from 'next/cache'
import { getPage } from '@/lib/pages/get'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabasePublicClient } from '@/lib/supabase/server'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors?: Partial<Record<'name' | 'email' | 'message', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim().slice(0, 200)
  const email = String(formData.get('email') ?? '').trim().slice(0, 320)
  const companyName = String(formData.get('company') ?? '').trim().slice(0, 200)
  const message = String(formData.get('message') ?? '').trim().slice(0, 5000)
  // Honeypot field — bots fill this, humans never see it.
  const honeypot = String(formData.get('website') ?? '').trim()

  const errors: ContactState['errors'] = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10)
    errors.message = 'Please provide a little more detail (at least 10 characters).'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please correct the highlighted fields and try again.',
      errors,
    }
  }

  const copy = await getPage('contact')

  // Silently accept honeypot submissions so bots think they succeeded.
  if (honeypot) return { status: 'success', message: copy['form.successMessage'] }

  // 1. Save to the database: it appears under Admin → Enquiries.
  let saved = false
  if (isSupabaseConfigured) {
    const { error } = await createSupabasePublicClient()
      .from('enquiries')
      .insert({ name, email, company: companyName || null, message, source: '/contact' })
    if (error) console.error('[contact] Could not save enquiry:', error.message)
    else saved = true
  }

  // 2. Optional extra delivery (e.g. a Zapier/Make webhook that emails you).
  let forwarded = false
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: companyName || null,
          message,
          submittedAt: new Date().toISOString(),
          source: '/contact',
        }),
      })
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`)
      forwarded = true
    } catch (error) {
      console.error('[contact] Webhook failed:', (error as Error).message)
    }
  }

  // Never tell a visitor their message was sent when it went nowhere.
  if (!saved && !forwarded) return { status: 'error', message: copy['form.errorMessage'] }

  if (saved) revalidatePath('/admin', 'layout')
  return { status: 'success', message: copy['form.successMessage'] }
}
