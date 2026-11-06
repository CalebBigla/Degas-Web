import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { LegalBody, LegalSection } from '@/components/legal'
import { company } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms that apply when you use the Degas Concepts Limited website.',
}

// DRAFT — to be reviewed by a lawyer before publication.
export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The rules for using this website. Client projects are covered by a separate written agreement."
      />

      <LegalBody lastUpdated="[EFFECTIVE_DATE]">
        <LegalSection title="About these terms">
          <p>
            These terms apply to your use of this website, which is operated by{' '}
            {company.name}, a company registered with Nigeria&apos;s Corporate Affairs
            Commission, RC {company.rcNumber}. By using the site, you agree to these terms.
            If you do not agree, please do not use the site.
          </p>
        </LegalSection>

        <LegalSection title="Our services are agreed separately">
          <p>
            The information on this website describes what we do in general terms. It is
            not an offer or a binding quote. Any project we take on is governed by a
            separate written proposal or contract, which sets out the scope, price,
            timeline, payment terms, and ownership of the work. If that contract conflicts
            with these terms, the contract wins.
          </p>
        </LegalSection>

        <LegalSection title="Using the site">
          <p>You agree not to:</p>
          <ul>
            <li>use the site for anything unlawful or fraudulent;</li>
            <li>send spam, malicious code, or automated submissions through our forms;</li>
            <li>try to gain unauthorised access to the site or the systems behind it; or</li>
            <li>copy or reuse the site&apos;s content in a way that breaks the next section.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Our content">
          <p>
            The text, design, logo, and other material on this site belong to{' '}
            {company.name} or are used with permission. You may view and share pages for
            your own non-commercial purposes, but you may not copy, sell, or republish them
            without our written permission.
          </p>
          <p>
            Our portfolio describes work we have delivered. Some client names and details
            are summarised or left out to respect confidentiality.
          </p>
        </LegalSection>

        <LegalSection title="Accuracy and availability">
          <p>
            We try to keep the site accurate and available, but we provide it &quot;as
            is&quot;. We do not guarantee that it will always be error-free or
            uninterrupted, and we may change or remove content at any time.
          </p>
        </LegalSection>

        <LegalSection title="Links to other websites">
          <p>
            The site links to services we do not control, such as LinkedIn and WhatsApp.
            We are not responsible for their content or how they handle your information.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the extent the law allows, we are not liable for any indirect or
            consequential loss arising from your use of this website. Nothing in these
            terms limits liability that cannot legally be limited, or the rights you have
            as a consumer under the law of the country where you live.
          </p>
        </LegalSection>

        <LegalSection title="Privacy">
          <p>
            Our <Link href="/privacy">Privacy Policy</Link> explains what information we
            collect through this site and how we use it.
          </p>
        </LegalSection>

        <LegalSection title="Governing law">
          <p>
            These terms are governed by the laws of the Federal Republic of Nigeria. This
            does not take away any mandatory consumer protection rights you have where you
            live.
          </p>
        </LegalSection>

        <LegalSection title="Changes and contact">
          <p>
            We may update these terms from time to time. The date at the top of this page
            shows when they last changed. Questions? Email{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  )
}
