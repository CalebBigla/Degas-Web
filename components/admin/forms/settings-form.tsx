'use client'

import { useActionState } from 'react'
import { saveSettings } from '@/lib/admin/actions'
import { fieldValues, initialFormState } from '@/lib/admin/form'
import type { SiteSettings } from '@/lib/content-types'
import { Card } from '@/components/admin/ui'
import { TextAreaField, TextField } from '@/components/admin/fields'
import { FormAlert, SubmitButton } from '@/components/admin/form-controls'

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, initialFormState)
  const e = state.errors ?? {}
  const f = fieldValues(state)

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <FormAlert state={state} />

      <Card title="Company" description="Used in the header, footer, legal pages and page titles.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="name" label="Legal name" defaultValue={f.text('name', settings.name)} error={e.name} />
          <TextField name="short_name" label="Short name" defaultValue={f.text('short_name', settings.shortName)} error={e.short_name} />
          <div className="sm:col-span-2">
            <TextField name="tagline" label="Tagline" defaultValue={f.text('tagline', settings.tagline)} error={e.tagline} />
          </div>
        </div>
      </Card>

      <Card title="Vision & mission" description="Shown on the About page.">
        <div className="flex flex-col gap-5">
          <TextAreaField name="vision" label="Vision" rows={2} defaultValue={f.text('vision', settings.vision)} error={e.vision} />
          <TextAreaField name="mission" label="Mission" rows={2} defaultValue={f.text('mission', settings.mission)} error={e.mission} />
        </div>
      </Card>

      <Card title="Contact details" description="Shown on the Contact page and in the footer.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="email" label="Email" type="email" defaultValue={f.text('email', settings.email)} error={e.email} />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            defaultValue={f.text('phone', settings.phone)}
            error={e.phone}
            help="International format, e.g. +234 901 600 9641"
          />
          <TextField
            name="whatsapp"
            label="WhatsApp link"
            type="url"
            defaultValue={f.text('whatsapp', settings.whatsapp)}
            error={e.whatsapp}
            help="https://wa.me/ followed by the number without + or spaces."
          />
          <TextField name="linkedin" label="LinkedIn URL" type="url" defaultValue={f.text('linkedin', settings.linkedin)} error={e.linkedin} />
        </div>
      </Card>

      <Card title="Business details" description="Builds trust with international clients.">
        <div className="flex flex-col gap-5">
          <TextField
            name="rc_number"
            label="CAC RC number"
            defaultValue={f.text('rc_number', settings.rcNumber)}
            error={e.rc_number}
            help="Shown in the hero badge, footer and legal pages."
          />
          <TextField name="working_hours" label="Working hours" defaultValue={f.text('working_hours', settings.workingHours)} error={e.working_hours} />
          <TextField
            name="payment_options"
            label="Payment options"
            defaultValue={f.text('payment_options', settings.paymentOptions)}
            error={e.payment_options}
          />
        </div>
      </Card>

      <Card
        title="Address & social profiles"
        description="Helps Google connect your website, company and official profiles. Leave blank anything you don’t have."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextAreaField
              name="address"
              label="Registered business address"
              optional
              rows={2}
              defaultValue={f.text('address', settings.address)}
              error={e.address}
              help="Use exactly the same address everywhere it is published (Google Business Profile, CAC records, directories)."
            />
          </div>
          <TextField name="instagram" label="Instagram URL" type="url" optional defaultValue={f.text('instagram', settings.instagram)} error={e.instagram} />
          <TextField name="x_url" label="X (Twitter) URL" type="url" optional defaultValue={f.text('x_url', settings.xUrl)} error={e.x_url} />
          <TextField name="facebook" label="Facebook URL" type="url" optional defaultValue={f.text('facebook', settings.facebook)} error={e.facebook} />
        </div>
      </Card>

      <Card
        title="Search engine verification"
        description="Proves to Google and Bing that you own the site, so you can see search traffic and submit the sitemap."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="google_verification"
            label="Google Search Console code"
            optional
            defaultValue={f.text('google_verification', settings.googleVerification)}
            error={e.google_verification}
            help="Search Console → Add property → URL prefix → HTML tag. Paste the code or the whole tag."
          />
          <TextField
            name="bing_verification"
            label="Bing Webmaster Tools code"
            optional
            defaultValue={f.text('bing_verification', settings.bingVerification)}
            error={e.bing_verification}
            help="Bing Webmaster Tools → Add site → HTML meta tag. Or import straight from Search Console."
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  )
}
