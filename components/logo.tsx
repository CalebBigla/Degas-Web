import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/logo.png"
        alt="Degas Concepts Logo"
        width={100}
        height={32}
        className="h-full w-auto object-contain"
        priority
      />
    </span>
  )
}
