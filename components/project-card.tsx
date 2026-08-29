import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/lib/site-data'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
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
        <Link
          href={`/work/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
        >
          View Case Study
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
