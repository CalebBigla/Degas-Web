'use server'

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
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const companyName = String(formData.get('company') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
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

  // Silently accept honeypot submissions so bots think they succeeded.
  if (honeypot) {
    return { status: 'success', message: 'Thank you. We will be in touch shortly.' }
  }

  const payload = {
    name,
    email,
    company: companyName || null,
    message,
    submittedAt: new Date().toISOString(),
    source: 'degasconcepts.com/contact',
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL

  try {
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`)
    } else {
      // No webhook configured yet — log so the submission is captured in server logs.
      // Set CONTACT_WEBHOOK_URL (e.g. a Zapier/Make/email webhook) to deliver messages.
      console.log('[v0] Contact form submission:', payload)
    }

    return {
      status: 'success',
      message: 'Thank you for reaching out. We will get back to you shortly.',
    }
  } catch (error) {
    console.log('[v0] Contact form error:', (error as Error).message)
    return {
      status: 'error',
      message:
        'Something went wrong sending your message. Please email us directly at degasconcept@gmail.com.',
    }
  }
}
