import {
  PenTool,
  Code2,
  Layout,
  Layers,
  Smartphone,
  MousePointerClick,
  ShieldCheck,
  Handshake,
  Clock,
  type LucideIcon,
} from 'lucide-react'

export const siteUrl = 'https://degasconcepts.com'

export const company = {
  name: 'Degas Concepts Limited',
  shortName: 'Degas Concepts',
  tagline: 'Simplicity and Excellence',
  vision:
    'To simplify solutions across the tech space with simplicity and excellence.',
  mission: 'To be the trusted provider of tech solutions.',
  phone: '+234 901 600 9641',
  whatsapp: 'https://wa.me/2349016009641',
  email: 'degasconcept@gmail.com',
  linkedin: 'https://linkedin.com/in/caleb-joshua',
  cacNote: 'CAC-registered company (RC-verified)',
  // Replace with the real Corporate Affairs Commission registration number.
  rcNumber: '[RC_NUMBER]',
  workingHours:
    'Mon–Fri, 9:00–18:00 WAT (UTC+1), with overlap for UK/EU and morning US hours',
  paymentOptions: 'Invoicing in USD, GBP, EUR or NGN; bank transfer, Wise or Payoneer',
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
]

export const trustBadges = [
  'CAC Registered',
  '5+ Years Combined Experience',
  '20+ Projects Delivered',
]

export type TeamMember = {
  name: string
  role: string
  experience: string
  bio: string
  linkedin?: string
  /** Path to a real photo in /public. Omit to show an initials avatar instead. */
  image?: string
}

export const team: TeamMember[] = [
  {
    name: 'Caleb Joshua',
    role: 'Lead Developer — UI/UX Designer & Web Experience Developer',
    experience: '5+ years experience',
    bio: 'Leads design and web engineering, turning complex requirements into clean, dependable products.',
    linkedin: company.linkedin,
    image: '/ceo.jpg',
  },
]

export type Client = {
  name: string
  /** Logo in /public/clients (SVG or transparent PNG). Omit to show the name as a wordmark. */
  logo?: string
}

// Replace these placeholders with real clients, e.g.
// { name: 'Acme Bank', logo: '/clients/acme-bank.svg' }
export const clients: Client[] = [
  { name: '[CLIENT_NAME_1]' },
  { name: '[CLIENT_NAME_2]' },
  { name: '[CLIENT_NAME_3]' },
  { name: '[CLIENT_NAME_4]' },
  { name: '[CLIENT_NAME_5]' },
  { name: '[CLIENT_NAME_6]' },
]

export type Service = {
  slug: string
  title: string
  icon: LucideIcon
  summary: string
  description: string
  included: string[]
}

export const services: Service[] = [
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: PenTool,
    summary: 'Intuitive interfaces designed around real user behaviour.',
    description:
      'We research, wireframe, and design interfaces that are clear, accessible, and easy to use — turning complex flows into simple experiences.',
    included: [
      'User research & journey mapping',
      'Wireframes & interactive prototypes',
      'Design systems & component libraries',
      'Usability testing & iteration',
    ],
  },
  {
    slug: 'web-development',
    title: 'Web Design & Development',
    icon: Code2,
    summary: 'Fast, secure, and scalable websites and web applications.',
    description:
      'From marketing sites to full web applications, we build responsive, performant products using modern, maintainable technology.',
    included: [
      'Responsive front-end development',
      'Custom web application builds',
      'API design & integration',
      'Performance & SEO optimization',
    ],
  },
  {
    slug: 'wordpress-development',
    title: 'WordPress Development',
    icon: Layout,
    summary: 'Custom themes and reliable content-managed websites.',
    description:
      'We deliver flexible, easy-to-manage WordPress sites with custom themes, plugins, and integrations tailored to your workflow.',
    included: [
      'Custom theme development',
      'Plugin configuration & customization',
      'Content migration & setup',
      'Maintenance & security hardening',
    ],
  },
  {
    slug: 'product-design',
    title: 'Product Design',
    icon: Layers,
    summary: 'End-to-end design for digital products that scale.',
    description:
      'We partner with teams to define, design, and refine digital products — balancing user needs with business goals at every stage.',
    included: [
      'Product discovery & strategy',
      'Information architecture',
      'High-fidelity UI design',
      'Design handoff & QA',
    ],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    icon: Smartphone,
    summary: 'Native-quality mobile apps for iOS and Android.',
    description:
      'We build cross-platform and native mobile applications that feel fast, reliable, and consistent across devices.',
    included: [
      'iOS & Android development',
      'Cross-platform builds',
      'Push notifications & offline support',
      'App store deployment support',
    ],
  },
  {
    slug: 'landing-pages',
    title: 'Landing Pages',
    icon: MousePointerClick,
    summary: 'Conversion-focused pages that turn visitors into customers.',
    description:
      'High-impact landing pages built for launches and campaigns — designed to communicate clearly and convert effectively.',
    included: [
      'Conversion-focused copy structure',
      'Responsive, fast-loading builds',
      'Analytics & tracking setup',
      'A/B test-ready layouts',
    ],
  },
]

export type Value = {
  title: string
  icon: LucideIcon
  description: string
}

export const coreValues: Value[] = [
  {
    title: 'Transparency',
    icon: ShieldCheck,
    description:
      'Clear process and honest pricing. You always know what we are doing, why, and what it costs.',
  },
  {
    title: 'Integrity',
    icon: Handshake,
    description:
      'We do what we say. Commitments are kept and quality is never quietly compromised.',
  },
  {
    title: 'Reliability',
    icon: Clock,
    description:
      'On-time, dependable delivery. We build solutions you can trust to keep running.',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description:
      'We start by understanding your goals, users, and constraints to define the right problem.',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'We translate requirements into clear, intuitive designs and validated prototypes.',
  },
  {
    step: '03',
    title: 'Build',
    description:
      'We engineer robust, scalable solutions with clean, maintainable code.',
  },
  {
    step: '04',
    title: 'Deliver & Support',
    description:
      'We ship on time and stay on to support, maintain, and improve what we built.',
  },
]

export type Project = {
  slug: string
  title: string
  category: string
  description: string
}

export const projects: Project[] = [
  {
    slug: 'kyc-verification-system',
    title: 'KYC Verification System',
    category: 'Fintech / Compliance',
    description:
      'A secure identity verification platform streamlining customer onboarding and compliance checks.',
  },
  {
    slug: 'real-estate-management-system',
    title: 'Real Estate Management System',
    category: 'Property Tech',
    description:
      'A management platform for listings, tenants, and payments with role-based dashboards.',
  },
  {
    slug: 'attendance-management-system',
    title: 'Attendance Management System',
    category: 'Enterprise Tools',
    description:
      'A time and attendance system with reporting, scheduling, and real-time tracking.',
  },
  {
    slug: 'job-portal-system',
    title: 'Job Portal System',
    category: 'Web Platform',
    description:
      'A job marketplace connecting employers and candidates with search, applications, and profiles.',
  },
  {
    slug: 'faith-based-community-app',
    title: 'Faith-Based Community App',
    category: 'Mobile App',
    description:
      'A community mobile app for events, giving, and member engagement built for scale.',
  },
  {
    slug: 'payroll-management-system',
    title: 'Payroll Management System',
    category: 'Enterprise Tools',
    description:
      'An automated payroll platform handling salaries, deductions, and compliant reporting.',
  },
]
