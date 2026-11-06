import Image from 'next/image'
import { cn } from '@/lib/utils'
import { clients, type Client } from '@/lib/site-data'

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <Image
        src={client.logo}
        alt={client.name}
        width={140}
        height={40}
        className="h-8 w-auto object-contain opacity-60 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
      />
    )
  }
  // Wordmark fallback for clients without a logo file yet.
  return (
    <span className="whitespace-nowrap font-heading text-lg font-bold tracking-tight text-muted-foreground/70 transition-colors duration-300 hover:text-foreground">
      {client.name}
    </span>
  )
}

function LogoGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      aria-label={duplicate ? undefined : 'Clients'}
      className={cn(
        'flex shrink-0 items-center gap-14 pr-14',
        // Reduced motion: a single static, centred, wrapping row.
        duplicate
          ? 'motion-reduce:hidden'
          : 'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:pr-0',
      )}
    >
      {clients.map((client) => (
        <li key={client.name} className="flex h-10 items-center">
          <ClientLogo client={client} />
        </li>
      ))}
    </ul>
  )
}

export function ClientMarquee() {
  if (clients.length === 0) return null

  return (
    <section className="border-b border-border bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Trusted by teams we&apos;ve built solutions for
        </p>
      </div>

      <div
        className="group mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {/* Two identical groups; the track slides -50% so the loop is seamless. Pauses on hover. */}
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
          style={{ '--marquee-duration': `${Math.max(clients.length * 6, 30)}s` } as React.CSSProperties}
        >
          <LogoGroup />
          <LogoGroup duplicate />
        </div>
      </div>
    </section>
  )
}
