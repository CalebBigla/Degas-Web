import {
  BarChart3,
  Briefcase,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  Handshake,
  HeartHandshake,
  Layers,
  Layout,
  Lightbulb,
  Lock,
  Megaphone,
  MousePointerClick,
  PenTool,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/** Icons that can be chosen for services and core values in the admin. */
export const iconRegistry = {
  PenTool,
  Code2,
  Layout,
  Layers,
  Smartphone,
  MousePointerClick,
  Globe,
  Database,
  Cloud,
  Cpu,
  Search,
  BarChart3,
  ShoppingCart,
  Megaphone,
  Rocket,
  Lightbulb,
  Wrench,
  Zap,
  Lock,
  ShieldCheck,
  Handshake,
  HeartHandshake,
  Clock,
  Target,
  Users,
  Briefcase,
  Sparkles,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconRegistry

export const iconNames = Object.keys(iconRegistry) as IconName[]

export function getIcon(name: string): LucideIcon {
  return (iconRegistry as Record<string, LucideIcon>)[name] ?? Sparkles
}
