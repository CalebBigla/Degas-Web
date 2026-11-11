/**
 * Static site structure, plus the built-in default content.
 *
 * Editable content (company info, services, values, projects, clients, team;
 * page copy lives in lib/pages/definitions.ts)
 * is managed in the admin dashboard and stored in Supabase. The defaults below
 * are only used when Supabase is not configured or cannot be reached, so the
 * site always renders. They mirror supabase/seed.sql.
 */
import type {
  Seo,
  Client,
  CoreValue,
  Project,
  Service,
  SiteSettings,
  TeamMember,
} from '@/lib/content-types'

/**
 * The live site's preferred address (canonical URLs, sitemap, structured data).
 * Set NEXT_PUBLIC_SITE_URL to override, e.g. for a staging domain.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.degasconcepts.com').replace(/\/+$/, '')

/** Site navigation. Labels are editable in the admin (Pages → Header & footer). */
export const navLinks = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.work', href: '/work' },
  { key: 'nav.insights', href: '/insights' },
  { key: 'nav.contact', href: '/contact' },
] as const

export type NavLink = { label: string; href: string }

// ---------------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------------

/** No search overrides: use the generated title, description and share card. */
const noSeo: Seo = { seoTitle: null, seoDescription: null, shareImage: null, noindex: false }

export const defaultSettings: SiteSettings = {
  name: 'Degas Concepts Limited',
  shortName: 'Degas Concepts',
  tagline: 'Simplicity and Excellence',
  vision: 'To simplify solutions across the tech space with simplicity and excellence.',
  mission: 'To be the trusted provider of tech solutions.',
  phone: '+234 901 600 9641',
  whatsapp: 'https://wa.me/2349016009641',
  email: 'degasconcept@gmail.com',
  linkedin: 'https://linkedin.com/in/caleb-joshua',
  rcNumber: '[RC_NUMBER]',
  workingHours:
    'Mon–Fri, 9:00–18:00 WAT (UTC+1), with overlap for UK/EU and morning US hours',
  paymentOptions: 'Invoicing in USD, GBP, EUR or NGN; bank transfer, Wise or Payoneer',
  address: '',
  instagram: '',
  xUrl: '',
  facebook: '',
  googleVerification: '',
  bingVerification: '',
}

export const defaultTeam: TeamMember[] = [
  {
    id: 'caleb-joshua',
    name: 'Caleb Joshua',
    role: 'Lead Developer — UI/UX Designer & Web Experience Developer',
    experience: '5+ years experience',
    bio: 'Leads design and web engineering, turning complex requirements into clean, dependable products.',
    linkedin: defaultSettings.linkedin,
    image: '/ceo.jpg',
    published: true,
  },
]

/** Real clients are added in /admin/clients. The marquee hides while this is empty. */
export const defaultClients: Client[] = []

export const defaultServices: Service[] = [
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'PenTool',
    summary: 'Intuitive interfaces designed around real user behaviour.',
    description:
      'We research, wireframe, and design interfaces that are clear, accessible, and easy to use — turning complex flows into simple experiences.',
    included: [
      'User research & journey mapping',
      'Wireframes & interactive prototypes',
      'Design systems & component libraries',
      'Usability testing & iteration',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
  {
    id: 'web-development',
    slug: 'web-development',
    title: 'Web Design & Development',
    icon: 'Code2',
    summary: 'Fast, secure, and scalable websites and web applications.',
    description:
      'From marketing sites to full web applications, we build responsive, performant products using modern, maintainable technology.',
    included: [
      'Responsive front-end development',
      'Custom web application builds',
      'API design & integration',
      'Performance & SEO optimization',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
  {
    id: 'wordpress-development',
    slug: 'wordpress-development',
    title: 'WordPress Development',
    icon: 'Layout',
    summary: 'Custom themes and reliable content-managed websites.',
    description:
      'We deliver flexible, easy-to-manage WordPress sites with custom themes, plugins, and integrations tailored to your workflow.',
    included: [
      'Custom theme development',
      'Plugin configuration & customization',
      'Content migration & setup',
      'Maintenance & security hardening',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
  {
    id: 'product-design',
    slug: 'product-design',
    title: 'Product Design',
    icon: 'Layers',
    summary: 'End-to-end design for digital products that scale.',
    description:
      'We partner with teams to define, design, and refine digital products — balancing user needs with business goals at every stage.',
    included: [
      'Product discovery & strategy',
      'Information architecture',
      'High-fidelity UI design',
      'Design handoff & QA',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
  {
    id: 'mobile-app-development',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    icon: 'Smartphone',
    summary: 'Native-quality mobile apps for iOS and Android.',
    description:
      'We build cross-platform and native mobile applications that feel fast, reliable, and consistent across devices.',
    included: [
      'iOS & Android development',
      'Cross-platform builds',
      'Push notifications & offline support',
      'App store deployment support',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
  {
    id: 'landing-pages',
    slug: 'landing-pages',
    title: 'Landing Pages',
    icon: 'MousePointerClick',
    summary: 'Conversion-focused pages that turn visitors into customers.',
    description:
      'High-impact landing pages built for launches and campaigns — designed to communicate clearly and convert effectively.',
    included: [
      'Conversion-focused copy structure',
      'Responsive, fast-loading builds',
      'Analytics & tracking setup',
      'A/B test-ready layouts',
    ],
    body: '',
    audience: '',
    faqs: [],
    published: true,
    ...noSeo,
  },
]

export const defaultCoreValues: CoreValue[] = [
  {
    id: 'transparency',
    title: 'Transparency',
    icon: 'ShieldCheck',
    description:
      'Clear process and honest pricing. You always know what we are doing, why, and what it costs.',
    published: true,
  },
  {
    id: 'integrity',
    title: 'Integrity',
    icon: 'Handshake',
    description:
      'We do what we say. Commitments are kept and quality is never quietly compromised.',
    published: true,
  },
  {
    id: 'reliability',
    title: 'Reliability',
    icon: 'Clock',
    description:
      'On-time, dependable delivery. We build solutions you can trust to keep running.',
    published: true,
  },
]

const project = (
  slug: string,
  title: string,
  category: string,
  description: string,
  featured: boolean,
): Project => ({
  id: slug,
  slug,
  title,
  category,
  description,
  overview: null,
  approach: null,
  highlights: [],
  servicesLabel: null,
  coverImage: null,
  coverAlt: null,
  results: null,
  serviceIds: [],
  featured,
  published: true,
  ...noSeo,
})

export const defaultProjects: Project[] = [
  project(
    'kyc-verification-system',
    'KYC Verification System',
    'Fintech / Compliance',
    'A secure identity verification platform streamlining customer onboarding and compliance checks.',
    true,
  ),
  project(
    'real-estate-management-system',
    'Real Estate Management System',
    'Property Tech',
    'A management platform for listings, tenants, and payments with role-based dashboards.',
    true,
  ),
  project(
    'attendance-management-system',
    'Attendance Management System',
    'Enterprise Tools',
    'A time and attendance system with reporting, scheduling, and real-time tracking.',
    true,
  ),
  project(
    'job-portal-system',
    'Job Portal System',
    'Web Platform',
    'A job marketplace connecting employers and candidates with search, applications, and profiles.',
    true,
  ),
  project(
    'faith-based-community-app',
    'Faith-Based Community App',
    'Mobile App',
    'A community mobile app for events, giving, and member engagement built for scale.',
    false,
  ),
  project(
    'payroll-management-system',
    'Payroll Management System',
    'Enterprise Tools',
    'An automated payroll platform handling salaries, deductions, and compliant reporting.',
    false,
  ),
]
