/**
 * Editable page copy: the default text for every public page, plus the
 * description of each editable field (used to build the admin editor and to
 * validate what it saves).
 *
 * Stored content lives in the `pages` table (one row per page, JSON keyed by
 * the field keys below). Any key that has not been saved yet falls back to the
 * default here, so new fields can be added without a migration.
 *
 * This module is shared by server and client code: keep it free of imports
 * that only work on one side.
 */

// -----------------------------------------------------------------------------
// Field model
// -----------------------------------------------------------------------------

export type GroupItem = Record<string, string>
export type PageValue = string | boolean | string[] | GroupItem[]

type BaseField<K extends string> = {
  key: K
  label: string
  help?: string
  required?: boolean
  max?: number
}

export type SubField = {
  key: string
  label: string
  kind: 'text' | 'textarea' | 'richtext'
  required?: boolean
  max?: number
  help?: string
}

export type FieldDef<K extends string = string> =
  | (BaseField<K> & { kind: 'text' | 'textarea' | 'richtext' | 'list' | 'toggle' })
  | (BaseField<K> & {
      kind: 'group'
      itemLabel: string
      fields: SubField[]
      minItems?: number
      maxItems?: number
    })

export type SectionDef<K extends string = string> = {
  id: string
  title: string
  description?: string
  fields: FieldDef<K>[]
}

export type PageDef<K extends string = string> = {
  label: string
  description: string
  /** Public URL of the page, or null for site-wide content. */
  path: string | null
  sections: SectionDef<K>[]
}

const DEFAULT_MAX = { text: 200, textarea: 1000, richtext: 10000, list: 300 } as const

export function fieldMax(field: { kind: string; max?: number }): number {
  return field.max ?? DEFAULT_MAX[field.kind as keyof typeof DEFAULT_MAX] ?? 1000
}

/** Placeholders that are replaced with company info wherever they appear. */
export const TOKENS = [
  ['{company}', 'Company name'],
  ['{short_name}', 'Short name'],
  ['{tagline}', 'Tagline'],
  ['{rc_number}', 'RC number'],
  ['{email}', 'Email'],
  ['{phone}', 'Phone'],
] as const

// -----------------------------------------------------------------------------
// Default content
// -----------------------------------------------------------------------------

const site = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.services': 'Services',
  'nav.work': 'Work',
  'nav.contact': 'Contact',
  'header.cta': 'Get a Quote',
  'footer.blurb':
    '{tagline}. A CAC-registered tech solutions company simplifying solutions across the tech space.',
  'footer.badge': 'CAC Registered',
  'footer.companyHeading': 'Company',
  'footer.contactHeading': 'Get in touch',
  'footer.linkedinLabel': 'LinkedIn',
  'footer.registration': "Registered with Nigeria's Corporate Affairs Commission, RC {rc_number}",
  'footer.privacyLabel': 'Privacy Policy',
  'footer.termsLabel': 'Terms of Use',
  'footer.slogan': 'Simplicity and Excellence.',
  'seo.title': '{company} — {tagline}',
  'seo.description':
    '{company} is a CAC-registered tech solutions company. We simplify solutions across the tech space with simplicity and excellence — design, web, mobile, and product engineering.',
}

const home = {
  'hero.eyebrow': '{tagline}',
  'hero.title': 'We simplify solutions across the **tech space**',
  'hero.intro':
    '{company} is a trusted provider of tech solutions. From design to deployment, we build reliable products with clarity, integrity, and excellence at every step.',
  'hero.primaryCta': 'Get a Quote',
  'hero.secondaryCta': 'View Our Work',
  'hero.badges': [
    'Registered company (CAC RC {rc_number})',
    '5+ Years Combined Experience',
    '20+ Projects Delivered',
  ],
  'clients.heading': "Trusted by teams we've built solutions for",
  'services.eyebrow': 'What we do',
  'services.title': 'Services built for reliable outcomes',
  'services.description':
    'A full-stack team covering design, web, mobile, and product — so you can ship complete solutions with a single trusted partner.',
  'values.eyebrow': 'Why Degas Concepts',
  'values.title': 'Principles that guide every project',
  'values.description':
    'Our core values are not slogans — they define how we plan, communicate, and deliver.',
  'process.eyebrow': 'How we work',
  'process.title': 'A clear path from idea to delivery',
  'process.description':
    'A simple, transparent process that keeps you informed and in control at every stage.',
  'process.steps': [
    {
      title: 'Discover',
      description:
        'We start by understanding your goals, users, and constraints to define the right problem.',
    },
    {
      title: 'Design',
      description:
        'We translate requirements into clear, intuitive designs and validated prototypes.',
    },
    {
      title: 'Build',
      description: 'We engineer robust, scalable solutions with clean, maintainable code.',
    },
    {
      title: 'Deliver & Support',
      description:
        'We ship on time and stay on to support, maintain, and improve what we built.',
    },
  ] as GroupItem[],
  'work.eyebrow': 'Featured work',
  'work.title': 'Solutions we have delivered',
  'work.description':
    'A selection of systems we have designed and built for teams across industries.',
  'work.linkLabel': 'View all work',
  'cta.title': 'Ready to build something reliable?',
  'cta.description':
    'Tell us about your project. We will help you simplify it and ship it with excellence.',
  'cta.primaryLabel': 'Contact Us',
  'cta.secondaryLabel': 'View Our Work',
}

const about = {
  'seo.title': 'About',
  'seo.description':
    '{company} is a CAC-registered tech solutions company built on transparency, integrity, and reliability — simplifying solutions across the tech space.',
  'hero.eyebrow': 'About us',
  'hero.title': 'A trusted partner for tech solutions',
  'hero.description':
    '{company} exists to simplify how organizations adopt and build technology — combining thoughtful design with dependable engineering.',
  'story.eyebrow': 'Who we are',
  'story.title': 'Built to simplify, engineered to last',
  'story.body': [
    '{company} — DEsiGn And Softwares — is a CAC-registered technology company delivering design and software solutions to businesses that value clarity and quality. We bring together a multidisciplinary team spanning product design, web, and mobile development.',
    'Our approach is simple: understand the problem deeply, design the clearest possible solution, and build it reliably. That discipline has allowed us to deliver systems across fintech, real estate, enterprise tools, and community platforms — each held to the same standard of simplicity and excellence.',
    'We measure success by the trust our clients place in us and the dependability of what we ship. That is the standard we hold on every engagement.',
  ].join('\n\n'),
  'vision.title': 'Our Vision',
  'mission.title': 'Our Mission',
  'values.eyebrow': 'Core values',
  'values.title': 'What we stand for',
  'values.description':
    'Three commitments that shape how we work with every client and on every project.',
  'team.eyebrow': 'Our team',
  'team.title': 'The people behind the work',
  'team.description':
    'A focused team of designers and engineers dedicated to shipping dependable products.',
  'team.linkedinLabel': 'LinkedIn',
  'cta.title': "Let's build something reliable together",
  'cta.description': 'Partner with a team that values clarity, honesty, and dependable delivery.',
  'cta.primaryLabel': 'Contact Us',
  'cta.secondaryLabel': 'View Our Work',
}

const services = {
  'seo.title': 'Services',
  'seo.description':
    'Explore our services: UI/UX Design, Web Design & Development, WordPress Development, Product Design, Mobile App Development, and Landing Pages — delivered with simplicity and excellence.',
  'hero.eyebrow': 'Services',
  'hero.title': 'Everything you need to build and ship',
  'hero.description':
    'A complete range of design and development services, each delivered with a focus on clarity, quality, and dependable results.',
  'list.includedLabel': "What's included",
  'cta.title': 'Not sure which service you need?',
  'cta.description':
    "Tell us what you're trying to achieve and we'll recommend the right approach — and a clear quote.",
  'cta.primaryLabel': 'Request a Quote',
  'cta.secondaryLabel': 'View Our Work',
}

const work = {
  'seo.title': 'Work',
  'seo.description':
    'Case studies from {company} — KYC verification, real estate management, job portals, payroll, attendance systems, and community apps built with simplicity and excellence.',
  'hero.eyebrow': 'Our work',
  'hero.title': 'Systems we have designed and delivered',
  'hero.description':
    'A selection of the products and platforms we have shipped for teams across fintech, real estate, enterprise, and community sectors.',
  'cta.title': 'Have a project like these?',
  'cta.description':
    "We'd love to hear about it. Let's scope it together and give you a clear, honest quote.",
  'cta.primaryLabel': 'Contact Us',
  'cta.secondaryLabel': 'View Our Work',
  'case.backLabel': 'Back to Work',
  'case.overviewHeading': 'Overview',
  'case.approachHeading': 'The approach',
  'case.highlightsHeading': 'What we delivered',
  'case.detailsHeading': 'Project details',
  'case.categoryLabel': 'Category',
  'case.servicesLabel': 'Services',
  'case.deliveryLabel': 'Delivery',
  'case.deliveryValue': 'On time',
  'case.ctaLabel': 'Start a similar project',
  'case.defaultOverview':
    'We partnered with the client to design and build the {title}, translating complex requirements into a simple, reliable product. Our team led the effort end to end — from discovery and design through engineering and delivery.',
  'case.defaultApproach':
    "Following our Discover, Design, Build, and Deliver process, we prioritized clarity at every stage — ensuring the solution was easy to use, secure, and built to scale with the client's needs.",
  'case.defaultHighlights': [
    'Clear discovery and scoping before a single line of code',
    'Design system for a consistent, accessible interface',
    'Scalable, well-documented, and maintainable codebase',
    'On-time delivery with ongoing support',
  ],
  'case.defaultServices': 'Design & Development',
}

const contact = {
  'seo.title': 'Contact',
  'seo.description':
    "Contact {company} — let's build something simple, reliable, and excellent. Reach us by phone, WhatsApp, or email, or request a quote through our contact form.",
  'hero.eyebrow': 'Contact',
  'hero.title': "Let's build something simple, reliable, and excellent.",
  'hero.description':
    "Tell us about your project and goals. We'll get back to you with clear next steps and an honest quote.",
  'form.title': 'Send us a message',
  'form.intro': 'Fill out the form and our team will respond promptly.',
  'form.nameLabel': 'Name',
  'form.emailLabel': 'Email',
  'form.companyLabel': 'Company',
  'form.optionalLabel': '(optional)',
  'form.messageLabel': 'Message',
  'form.submitLabel': 'Send Message',
  'form.sendingLabel': 'Sending…',
  'form.successTitle': 'Message sent',
  'form.successMessage': 'Thank you for reaching out. We will get back to you shortly.',
  'form.errorMessage':
    'Something went wrong sending your message. Please email us directly at {email}.',
  'direct.title': 'Reach us directly',
  'direct.whatsappLabel': 'Phone / WhatsApp',
  'direct.emailLabel': 'Email',
  'direct.callLabel': 'Call us',
  'trust.title': 'CAC Registered Company',
  'trust.body':
    "{company} is a registered Nigerian company. You're working with a legitimate, accountable team.",
  'location.title': 'Location',
  'location.body':
    'Nigeria — serving clients remotely worldwide. A physical office address can be added here as we grow.',
  'hours.title': 'Working hours',
  'payment.title': 'Payment options',
}

const legalNotice = {
  'notice.show': true,
  'notice.title': 'Draft — pending legal review',
  'notice.body':
    'This document is a plain-English draft and has not yet been reviewed by a lawyer. It will be updated before it is relied on.',
}

const privacy = {
  'seo.title': 'Privacy Policy',
  'seo.description':
    'How {company} collects, uses, and protects personal information submitted through this website.',
  'hero.eyebrow': 'Legal',
  'hero.title': 'Privacy Policy',
  'hero.description':
    'What we collect through this website, why we collect it, and how you can ask us to delete it.',
  ...legalNotice,
  'meta.lastUpdatedLabel': 'Last updated',
  'meta.lastUpdated': '[EFFECTIVE_DATE]',
  sections: [
    {
      title: 'Who we are',
      body: [
        'This website is operated by {company} ("we", "us"), a company registered with Nigeria\'s Corporate Affairs Commission, RC {rc_number}, with its registered address at [REGISTERED_ADDRESS]. We are responsible for the personal information described in this policy.',
        'We work with clients in Nigeria and internationally, including the European Union, the United Kingdom, and the United States. This policy is written to meet the expectations of the Nigeria Data Protection Act 2023 (NDPA), the EU and UK General Data Protection Regulation (GDPR), and US state privacy laws such as the California Consumer Privacy Act (CCPA).',
      ].join('\n\n'),
    },
    {
      title: 'What we collect',
      body: [
        '**When you use our contact form**, we collect:',
        '- your name;\n- your email address;\n- your company name, if you choose to give it; and\n- the message you write to us.',
        'We also record the date and time you sent the message. The form contains a hidden field used only to block automated spam.',
        '**When you contact us directly** by email, phone, or WhatsApp, we receive whatever you choose to send, such as your phone number and messages.',
        '**When you browse the site**, our hosting provider (Vercel) automatically processes basic technical data, such as your IP address and browser type, in order to deliver pages and keep the service secure.',
      ].join('\n\n'),
    },
    {
      title: 'Analytics: no cookies',
      body: [
        'We use Vercel Web Analytics to understand how many people visit the site and which pages they view. It is cookieless: it does not place cookies on your device and does not track you across other websites. Visitor counts are based on anonymised, aggregated data that we cannot use to identify you.',
        'Because we do not use cookies for analytics or advertising, we do not show a cookie banner.',
      ].join('\n\n'),
    },
    {
      title: 'How we use your information',
      body: [
        '- to reply to your enquiry and prepare a quote;\n- to discuss, plan, and deliver a project if you become a client; and\n- to keep the website secure and working properly.',
        'We do not sell your personal information, share it for advertising, or add you to a mailing list without your permission.',
        'Under the GDPR and NDPA, our legal basis is either taking steps at your request before entering into a contract, or our legitimate interest in responding to business enquiries and running a secure website.',
      ].join('\n\n'),
    },
    {
      title: 'Who we share it with',
      body: [
        'We share information only with service providers that help us run the site:',
        '- **Vercel Inc.** (United States), which hosts the website and provides analytics; and\n- **[CONTACT_FORM_PROVIDER]**, which delivers contact form messages to our inbox.',
        'We may also disclose information if the law requires it. Some of these providers are outside Nigeria, the EU, and the UK. Where that happens, we rely on the safeguards those providers offer for international data transfers, such as standard contractual clauses.',
      ].join('\n\n'),
    },
    {
      title: 'How long we keep it',
      body: 'We keep enquiries for [RETENTION_PERIOD] after our last contact with you, unless you become a client, in which case we keep project records for as long as we need them to deliver our services and meet our legal and accounting obligations.',
    },
    {
      title: 'Your rights and how to request deletion',
      body: [
        'Depending on where you live, you can ask us to access, correct, or delete the personal information we hold about you, to restrict or object to how we use it, or to give you a copy of it.',
        '**To request deletion** or exercise any other right, email [{email}](mailto:{email}) with the subject line "Privacy request" and tell us the email address you used to contact us. We will confirm your request and respond within 30 days.',
        "If you are unhappy with how we handle your information, you can complain to the Nigeria Data Protection Commission, the UK Information Commissioner's Office, or the data protection authority in your EU country.",
      ].join('\n\n'),
    },
    {
      title: 'Changes to this policy',
      body: 'We may update this policy from time to time. The date at the top of this page shows when it last changed.',
    },
  ] as GroupItem[],
}

const terms = {
  'seo.title': 'Terms of Use',
  'seo.description': 'The terms that apply when you use the {company} website.',
  'hero.eyebrow': 'Legal',
  'hero.title': 'Terms of Use',
  'hero.description':
    'The rules for using this website. Client projects are covered by a separate written agreement.',
  ...legalNotice,
  'meta.lastUpdatedLabel': 'Last updated',
  'meta.lastUpdated': '[EFFECTIVE_DATE]',
  sections: [
    {
      title: 'About these terms',
      body: "These terms apply to your use of this website, which is operated by {company}, a company registered with Nigeria's Corporate Affairs Commission, RC {rc_number}. By using the site, you agree to these terms. If you do not agree, please do not use the site.",
    },
    {
      title: 'Our services are agreed separately',
      body: 'The information on this website describes what we do in general terms. It is not an offer or a binding quote. Any project we take on is governed by a separate written proposal or contract, which sets out the scope, price, timeline, payment terms, and ownership of the work. If that contract conflicts with these terms, the contract wins.',
    },
    {
      title: 'Using the site',
      body: [
        'You agree not to:',
        "- use the site for anything unlawful or fraudulent;\n- send spam, malicious code, or automated submissions through our forms;\n- try to gain unauthorised access to the site or the systems behind it; or\n- copy or reuse the site's content in a way that breaks the next section.",
      ].join('\n\n'),
    },
    {
      title: 'Our content',
      body: [
        'The text, design, logo, and other material on this site belong to {company} or are used with permission. You may view and share pages for your own non-commercial purposes, but you may not copy, sell, or republish them without our written permission.',
        'Our portfolio describes work we have delivered. Some client names and details are summarised or left out to respect confidentiality.',
      ].join('\n\n'),
    },
    {
      title: 'Accuracy and availability',
      body: 'We try to keep the site accurate and available, but we provide it "as is". We do not guarantee that it will always be error-free or uninterrupted, and we may change or remove content at any time.',
    },
    {
      title: 'Links to other websites',
      body: 'The site links to services we do not control, such as LinkedIn and WhatsApp. We are not responsible for their content or how they handle your information.',
    },
    {
      title: 'Limitation of liability',
      body: 'To the extent the law allows, we are not liable for any indirect or consequential loss arising from your use of this website. Nothing in these terms limits liability that cannot legally be limited, or the rights you have as a consumer under the law of the country where you live.',
    },
    {
      title: 'Privacy',
      body: 'Our [Privacy Policy](/privacy) explains what information we collect through this site and how we use it.',
    },
    {
      title: 'Governing law',
      body: 'These terms are governed by the laws of the Federal Republic of Nigeria. This does not take away any mandatory consumer protection rights you have where you live.',
    },
    {
      title: 'Changes and contact',
      body: 'We may update these terms from time to time. The date at the top of this page shows when they last changed. Questions? Email [{email}](mailto:{email}).',
    },
  ] as GroupItem[],
}

export const pageDefaults = { home, about, services, work, contact, privacy, terms, site }

export type PageSlug = keyof typeof pageDefaults
export type PageContent<S extends PageSlug> = (typeof pageDefaults)[S]

export const PAGE_SLUGS = Object.keys(pageDefaults) as PageSlug[]

export function isPageSlug(value: string): value is PageSlug {
  return value in pageDefaults
}

// -----------------------------------------------------------------------------
// Editor definitions
// -----------------------------------------------------------------------------

type Key<S extends PageSlug> = Extract<keyof PageContent<S>, string>

function t<K extends string>(key: K, label: string, extra: Partial<BaseField<K>> = {}) {
  return { key, label, kind: 'text', required: true, ...extra } as FieldDef<K>
}
function area<K extends string>(key: K, label: string, extra: Partial<BaseField<K>> = {}) {
  return { key, label, kind: 'textarea', required: true, ...extra } as FieldDef<K>
}
function rich<K extends string>(key: K, label: string, extra: Partial<BaseField<K>> = {}) {
  return { key, label, kind: 'richtext', required: true, ...extra } as FieldDef<K>
}
function list<K extends string>(key: K, label: string, extra: Partial<BaseField<K>> = {}) {
  return { key, label, kind: 'list', ...extra } as FieldDef<K>
}

/** Standard page header + search-result fields. */
function heroSection<K extends string>(prefix: 'hero'): SectionDef<K> {
  return {
    id: 'hero',
    title: 'Page header',
    description: 'The dark banner at the top of the page.',
    fields: [
      t(`${prefix}.eyebrow` as K, 'Eyebrow', { help: 'Small label above the title.' }),
      t(`${prefix}.title` as K, 'Title'),
      area(`${prefix}.description` as K, 'Introduction'),
    ],
  }
}

function seoSection<K extends string>(): SectionDef<K> {
  return {
    id: 'seo',
    title: 'Search & sharing',
    description: 'Shown in Google results and link previews. Not visible on the page itself.',
    fields: [
      t('seo.title' as K, 'Page title', { max: 70, help: 'Keep under 60 characters.' }),
      area('seo.description' as K, 'Meta description', {
        max: 300,
        help: 'Aim for 120–160 characters.',
      }),
    ],
  }
}

function ctaSection<K extends string>(): SectionDef<K> {
  return {
    id: 'cta',
    title: 'Call to action',
    description: 'The dark banner near the bottom of the page.',
    fields: [
      t('cta.title' as K, 'Heading'),
      area('cta.description' as K, 'Text'),
      t('cta.primaryLabel' as K, 'Main button', { max: 40, help: 'Links to the Contact page.' }),
      t('cta.secondaryLabel' as K, 'Second button', { max: 40, help: 'Links to the Work page.' }),
    ],
  }
}

function sectionHeading<K extends string>(
  prefix: string,
  id: string,
  title: string,
  description: string,
  withDescription = true,
): SectionDef<K> {
  return {
    id,
    title,
    description,
    fields: [
      t(`${prefix}.eyebrow` as K, 'Eyebrow'),
      t(`${prefix}.title` as K, 'Heading'),
      ...(withDescription ? [area(`${prefix}.description` as K, 'Introduction')] : []),
    ],
  }
}

function legalSections<K extends string>(): SectionDef<K>[] {
  return [
    {
      id: 'notice',
      title: 'Draft notice',
      description: 'The red box at the top. Turn it off once a lawyer has reviewed the page.',
      fields: [
        { key: 'notice.show' as K, label: 'Show draft notice', kind: 'toggle' },
        t('notice.title' as K, 'Heading'),
        area('notice.body' as K, 'Text'),
      ],
    },
    {
      id: 'body',
      title: 'Content',
      fields: [
        t('meta.lastUpdatedLabel' as K, '“Last updated” label', { max: 40 }),
        t('meta.lastUpdated' as K, 'Last updated date', {
          required: false,
          help: 'For example: 10 November 2026. Leave empty to hide the line.',
        }),
        {
          key: 'sections' as K,
          label: 'Sections',
          kind: 'group',
          itemLabel: 'Section',
          minItems: 1,
          maxItems: 30,
          fields: [
            { key: 'title', label: 'Heading', kind: 'text', required: true },
            { key: 'body', label: 'Text', kind: 'richtext', required: true },
          ],
        },
      ],
    },
  ]
}

function definePage<S extends PageSlug>(_slug: S, def: PageDef<Key<S>>): PageDef<Key<S>> {
  return def
}

export const pageDefinitions: { [S in PageSlug]: PageDef<Key<S>> } = {
  home: definePage('home', {
    label: 'Home',
    description: 'Hero, section headings, process steps and the closing call to action.',
    path: '/',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        description: 'The first thing visitors see.',
        fields: [
          t('hero.eyebrow', 'Eyebrow', { help: 'Small pill above the headline.' }),
          t('hero.title', 'Headline', {
            help: 'Wrap words in **double asterisks** to highlight them with the animated gradient.',
          }),
          area('hero.intro', 'Introduction'),
          t('hero.primaryCta', 'Main button', { max: 40, help: 'Links to the Contact page.' }),
          t('hero.secondaryCta', 'Second button', { max: 40, help: 'Links to the Work page.' }),
          list('hero.badges', 'Trust badges', {
            help: 'One per line, shown under the buttons (up to 3 look best).',
          }),
        ],
      },
      {
        id: 'clients',
        title: 'Client logos',
        description: 'Only shown when at least one client is published.',
        fields: [t('clients.heading', 'Heading')],
      },
      sectionHeading('services', 'services', 'Services', 'Cards come from Content → Services.'),
      sectionHeading('values', 'values', 'Why choose us', 'Cards come from Content → Core values.'),
      {
        id: 'process',
        title: 'How we work',
        description: 'Steps are numbered automatically.',
        fields: [
          t('process.eyebrow', 'Eyebrow'),
          t('process.title', 'Heading'),
          area('process.description', 'Introduction'),
          {
            key: 'process.steps',
            label: 'Steps',
            kind: 'group',
            itemLabel: 'Step',
            minItems: 1,
            maxItems: 8,
            fields: [
              { key: 'title', label: 'Title', kind: 'text', required: true },
              { key: 'description', label: 'Description', kind: 'textarea', required: true },
            ],
          },
        ],
      },
      {
        id: 'work',
        title: 'Featured work',
        description: 'Projects marked “featured” in Content → Projects.',
        fields: [
          t('work.eyebrow', 'Eyebrow'),
          t('work.title', 'Heading'),
          area('work.description', 'Introduction'),
          t('work.linkLabel', 'Link text', { max: 40 }),
        ],
      },
      ctaSection(),
    ],
  }),

  about: definePage('about', {
    label: 'About',
    description: 'Company story, vision and mission headings, values and team sections.',
    path: '/about',
    sections: [
      heroSection('hero'),
      {
        id: 'story',
        title: 'Who we are',
        fields: [
          t('story.eyebrow', 'Eyebrow'),
          t('story.title', 'Heading'),
          rich('story.body', 'Story'),
        ],
      },
      {
        id: 'vision',
        title: 'Vision & mission',
        description: 'The statements themselves are edited in Settings → Company info.',
        fields: [t('vision.title', 'Vision heading'), t('mission.title', 'Mission heading')],
      },
      sectionHeading('values', 'values', 'Core values', 'Cards come from Content → Core values.'),
      {
        ...sectionHeading('team', 'team', 'Team', 'People come from Content → Team.'),
        fields: [
          t('team.eyebrow', 'Eyebrow'),
          t('team.title', 'Heading'),
          area('team.description', 'Introduction'),
          t('team.linkedinLabel', 'LinkedIn link text', { max: 40 }),
        ],
      },
      ctaSection(),
      seoSection(),
    ],
  }),

  services: definePage('services', {
    label: 'Services',
    description: 'Page header and labels. The services themselves are under Content.',
    path: '/services',
    sections: [
      heroSection('hero'),
      {
        id: 'list',
        title: 'Service list',
        description: 'Each service is edited in Content → Services.',
        fields: [t('list.includedLabel', '“Included” label', { max: 60 })],
      },
      ctaSection(),
      seoSection(),
    ],
  }),

  work: definePage('work', {
    label: 'Work',
    description: 'Work page header, plus the labels and default text of case study pages.',
    path: '/work',
    sections: [
      heroSection('hero'),
      ctaSection(),
      {
        id: 'case',
        title: 'Case study pages',
        description: 'Labels used on every project page.',
        fields: [
          t('case.backLabel', 'Back link', { max: 40 }),
          t('case.overviewHeading', 'Overview heading'),
          t('case.approachHeading', 'Approach heading'),
          t('case.highlightsHeading', 'Highlights heading'),
          t('case.detailsHeading', 'Details box heading'),
          t('case.categoryLabel', '“Category” label', { max: 40 }),
          t('case.servicesLabel', '“Services” label', { max: 40 }),
          t('case.deliveryLabel', '“Delivery” label', { max: 40 }),
          t('case.deliveryValue', 'Delivery value', { max: 60 }),
          t('case.ctaLabel', 'Button', { max: 60 }),
        ],
      },
      {
        id: 'case-defaults',
        title: 'Case study defaults',
        description:
          'Used for any project that leaves these fields empty. {title} is replaced with the project name.',
        fields: [
          area('case.defaultOverview', 'Overview'),
          area('case.defaultApproach', 'Approach'),
          list('case.defaultHighlights', 'Highlights', { help: 'One per line.' }),
          t('case.defaultServices', 'Services'),
        ],
      },
      seoSection(),
    ],
  }),

  contact: definePage('contact', {
    label: 'Contact',
    description: 'Page header, contact form wording and the information cards.',
    path: '/contact',
    sections: [
      heroSection('hero'),
      {
        id: 'form',
        title: 'Contact form',
        fields: [
          t('form.title', 'Heading'),
          area('form.intro', 'Introduction'),
          t('form.nameLabel', 'Name label', { max: 40 }),
          t('form.emailLabel', 'Email label', { max: 40 }),
          t('form.companyLabel', 'Company label', { max: 40 }),
          t('form.optionalLabel', '“Optional” hint', { max: 40 }),
          t('form.messageLabel', 'Message label', { max: 40 }),
          t('form.submitLabel', 'Send button', { max: 40 }),
          t('form.sendingLabel', 'Button while sending', { max: 40 }),
          t('form.successTitle', 'Success heading'),
          area('form.successMessage', 'Success message'),
          area('form.errorMessage', 'Error message', {
            help: 'Shown if the message could not be delivered.',
          }),
        ],
      },
      {
        id: 'direct',
        title: 'Reach us directly',
        description: 'Phone, email and WhatsApp come from Settings → Company info.',
        fields: [
          t('direct.title', 'Heading'),
          t('direct.whatsappLabel', 'WhatsApp label', { max: 40 }),
          t('direct.emailLabel', 'Email label', { max: 40 }),
          t('direct.callLabel', 'Phone label', { max: 40 }),
        ],
      },
      {
        id: 'cards',
        title: 'Information cards',
        description: 'Working hours and payment options text is in Settings → Company info.',
        fields: [
          t('trust.title', 'Registration card heading'),
          area('trust.body', 'Registration card text'),
          t('location.title', 'Location heading'),
          area('location.body', 'Location text'),
          t('hours.title', 'Working hours heading'),
          t('payment.title', 'Payment options heading'),
        ],
      },
      seoSection(),
    ],
  }),

  privacy: definePage('privacy', {
    label: 'Privacy Policy',
    description: 'The full privacy policy, section by section.',
    path: '/privacy',
    sections: [heroSection('hero'), ...legalSections<Key<'privacy'>>(), seoSection()],
  }),

  terms: definePage('terms', {
    label: 'Terms of Use',
    description: 'The full terms of use, section by section.',
    path: '/terms',
    sections: [heroSection('hero'), ...legalSections<Key<'terms'>>(), seoSection()],
  }),

  site: definePage('site', {
    label: 'Header & footer',
    description: 'Navigation labels, footer text and the default search description.',
    path: null,
    sections: [
      {
        id: 'nav',
        title: 'Navigation',
        description: 'Menu labels in the header and footer. Links stay the same.',
        fields: [
          t('nav.home', 'Home', { max: 30 }),
          t('nav.about', 'About', { max: 30 }),
          t('nav.services', 'Services', { max: 30 }),
          t('nav.work', 'Work', { max: 30 }),
          t('nav.contact', 'Contact', { max: 30 }),
          t('header.cta', 'Header button', { max: 30, help: 'Links to the Contact page.' }),
        ],
      },
      {
        id: 'footer',
        title: 'Footer',
        fields: [
          area('footer.blurb', 'About text'),
          t('footer.badge', 'Badge', { max: 40 }),
          t('footer.companyHeading', 'Links heading', { max: 40 }),
          t('footer.contactHeading', 'Contact heading', { max: 40 }),
          t('footer.linkedinLabel', 'LinkedIn link text', { max: 40 }),
          t('footer.registration', 'Registration line'),
          t('footer.privacyLabel', 'Privacy link', { max: 40 }),
          t('footer.termsLabel', 'Terms link', { max: 40 }),
          t('footer.slogan', 'Slogan', { required: false }),
        ],
      },
      {
        id: 'seo',
        title: 'Search & sharing defaults',
        description: 'Used for the home page and any page without its own.',
        fields: [
          t('seo.title', 'Site title', { max: 90 }),
          area('seo.description', 'Meta description', { max: 300 }),
        ],
      },
    ],
  }),
}

// -----------------------------------------------------------------------------
// Sanitising stored / submitted values
// -----------------------------------------------------------------------------

function cleanString(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  return value.replace(/\r\n?/g, '\n').trim().slice(0, max)
}

/**
 * Coerce an unknown value into the shape a field expects. Returns undefined
 * when the value is missing or has the wrong shape (the default is used then).
 */
export function sanitizeField(field: FieldDef, value: unknown): PageValue | undefined {
  switch (field.kind) {
    case 'toggle':
      return typeof value === 'boolean' ? value : undefined
    case 'list': {
      if (!Array.isArray(value)) return undefined
      return value
        .map((item) => cleanString(item, fieldMax(field)))
        .filter((item): item is string => Boolean(item))
        .slice(0, 50)
    }
    case 'group': {
      if (!Array.isArray(value)) return undefined
      return value
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .slice(0, field.maxItems ?? 50)
        .map((item) =>
          Object.fromEntries(
            field.fields.map((sub) => [sub.key, cleanString(item[sub.key], fieldMax(sub)) ?? '']),
          ),
        )
    }
    default:
      return cleanString(value, fieldMax(field))
  }
}

/** All fields of a page, flattened. */
export function pageFields(slug: PageSlug): FieldDef[] {
  return (pageDefinitions[slug] as PageDef).sections.flatMap((section) => section.fields)
}
