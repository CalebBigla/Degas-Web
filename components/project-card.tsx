import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/lib/content-types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent has-[a:focus-visible]:ring-offset-2">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        {project.coverImage ? (
          <>
            <Image
              src={project.coverImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Keeps the overlaid title readable on any screenshot. */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"
              aria-hidden="true"
            />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-30"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-navy-foreground backdrop-blur-sm">
          {project.category}
        </span>
        <span className="absolute bottom-4 left-4 right-4 font-heading text-xl font-bold text-navy-foreground">
          {project.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        {/* The ::after overlay stretches this link over the whole card: one focusable element. */}
        <Link
          href={`/work/${project.slug}`}
          aria-label={`View case study: ${project.title}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-opacity after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:opacity-80"
        >
          View Case Study
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
