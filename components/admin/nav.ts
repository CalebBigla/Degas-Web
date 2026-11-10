import {
  Building2,
  FileText,
  FolderKanban,
  Gem,
  Layers,
  LayoutDashboard,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { label: string; href: string; icon: LucideIcon; newHref?: string }

export const NAV: { heading: string | null; items: NavItem[] }[] = [
  {
    heading: null,
    items: [{ label: 'Overview', href: '/admin', icon: LayoutDashboard }],
  },
  {
    heading: 'Content',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban, newHref: '/admin/projects/new' },
      { label: 'Services', href: '/admin/services', icon: Layers, newHref: '/admin/services/new' },
      { label: 'Core values', href: '/admin/values', icon: Gem, newHref: '/admin/values/new' },
      { label: 'Clients', href: '/admin/clients', icon: Building2, newHref: '/admin/clients/new' },
      { label: 'Team', href: '/admin/team', icon: Users, newHref: '/admin/team/new' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Company info', href: '/admin/settings', icon: Settings },
      { label: 'Account', href: '/admin/account', icon: UserCog },
    ],
  },
]

export const NAV_ITEMS = NAV.flatMap((group) => group.items)

export function isActivePath(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`)
}
