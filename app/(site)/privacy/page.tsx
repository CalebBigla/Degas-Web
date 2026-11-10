import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { LegalBody, LegalSection } from '@/components/legal'
import { getSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Degas Concepts Limited collects, uses, and protects personal information submitted through this website.',
}

// DRAFT — to be reviewed by a lawyer before publication.
export default async function PrivacyPage() {
  const company = await getSettings()
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect through this website, why we collect it, and how you can ask us to delete it."
      />

      <LegalBody lastUpdated="[EFFECTIVE_DATE]">
        <LegalSection title="Who we are">
          <p>
            This website is operated by {company.name} (&quot;we&quot;, &quot;us&quot;), a
            company registered with Nigeria&apos;s Corporate Affairs Commission, RC{' '}
            {company.rcNumber}, with its registered address at [REGISTERED_ADDRESS]. We are
            responsible for the personal information described in this policy.
          </p>
          <p>
            We work with clients in Nigeria and internationally, including the European
            Union, the United Kingdom, and the United States. This policy is written to
            meet the expectations of the Nigeria Data Protection Act 2023 (NDPA), the EU
            and UK General Data Protection Regulation (GDPR), and US state privacy laws
            such as the California Consumer Privacy Act (CCPA).
          </p>
        </LegalSection>

        <LegalSection title="What we collect">
          <p>
            <strong>When you use our contact form</strong>, we collect:
          </p>
          <ul>
            <li>your name;</li>
            <li>your email address;</li>
            <li>your company name, if you choose to give it; and</li>
            <li>the message you write to us.</li>
          </ul>
          <p>
            We also record the date and time you sent the message. The form contains a
            hidden field used only to block automated spam.
          </p>
          <p>
            <strong>When you contact us directly</strong> by email, phone, or WhatsApp, we
            receive whatever you choose to send, such as your phone number and messages.
          </p>
          <p>
            <strong>When you browse the site</strong>, our hosting provider (Vercel)
            automatically processes basic technical data, such as your IP address and
            browser type, in order to deliver pages and keep the service secure.
          </p>
        </LegalSection>

        <LegalSection title="Analytics: no cookies">
          <p>
            We use Vercel Web Analytics to understand how many people visit the site and
            which pages they view. It is cookieless: it does not place cookies on your
            device and does not track you across other websites. Visitor counts are based
            on anonymised, aggregated data that we cannot use to identify you.
          </p>
          <p>
            Because we do not use cookies for analytics or advertising, we do not show a
            cookie banner.
          </p>
        </LegalSection>

        <LegalSection title="How we use your information">
          <ul>
            <li>to reply to your enquiry and prepare a quote;</li>
            <li>to discuss, plan, and deliver a project if you become a client; and</li>
            <li>to keep the website secure and working properly.</li>
          </ul>
          <p>
            We do not sell your personal information, share it for advertising, or add you
            to a mailing list without your permission.
          </p>
          <p>
            Under the GDPR and NDPA, our legal basis is either taking steps at your request
            before entering into a contract, or our legitimate interest in responding to
            business enquiries and running a secure website.
          </p>
        </LegalSection>

        <LegalSection title="Who we share it with">
          <p>We share information only with service providers that help us run the site:</p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (United States), which hosts the website and
              provides analytics; and
            </li>
            <li>
              <strong>[CONTACT_FORM_PROVIDER]</strong>, which delivers contact form
              messages to our inbox.
            </li>
          </ul>
          <p>
            We may also disclose information if the law requires it. Some of these
            providers are outside Nigeria, the EU, and the UK. Where that happens, we rely
            on the safeguards those providers offer for international data transfers, such
            as standard contractual clauses.
          </p>
        </LegalSection>

        <LegalSection title="How long we keep it">
          <p>
            We keep enquiries for [RETENTION_PERIOD] after our last contact with you, unless
            you become a client, in which case we keep project records for as long as we
            need them to deliver our services and meet our legal and accounting
            obligations.
          </p>
        </LegalSection>

        <LegalSection title="Your rights and how to request deletion">
          <p>
            Depending on where you live, you can ask us to access, correct, or delete the
            personal information we hold about you, to restrict or object to how we use it,
            or to give you a copy of it.
          </p>
          <p>
            <strong>To request deletion</strong> or exercise any other right, email{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a> with the subject line
            &quot;Privacy request&quot; and tell us the email address you used to contact
            us. We will confirm your request and respond within 30 days.
          </p>
          <p>
            If you are unhappy with how we handle your information, you can complain to the
            Nigeria Data Protection Commission, the UK Information Commissioner&apos;s
            Office, or the data protection authority in your EU country.
          </p>
        </LegalSection>

        <LegalSection title="Changes to this policy">
          <p>
            We may update this policy from time to time. The date at the top of this page
            shows when it last changed.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  )
}
