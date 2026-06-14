import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, GitFork } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import type { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-24">
      {/* Subtle divider */}
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="My Work"
          title="Featured Projects"
          subtitle="A selection of products, tools, and experiments I've built."
        />
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.slice(0, 4).map((project, i) => (
          <AnimatedSection key={project.id} delay={i * 0.1}>
            <div className="group relative rounded-2xl overflow-hidden glass hover:border-accent hover:shadow-xl hover:shadow-accent transition-all duration-300 hover:-translate-y-1">
              {/* Cover image */}
              <div className="relative h-52 overflow-hidden">
                {project.coverImageUrl ? (
                  <Image
                    src={project.coverImageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full gradient-bg opacity-60 flex items-center justify-center">
                    <span className="text-white/20 text-6xl font-bold select-none">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags?.slice(0, 4).map((tag) => (
                    <Badge key={tag.id} variant="purple">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent-muted transition-colors">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>

                <p className="text-secondary text-sm leading-relaxed mb-5 line-clamp-2">
                  {project.summary}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-medium text-accent hover:text-accent-muted transition-colors flex items-center gap-1"
                  >
                    Case study <ArrowRight size={13} />
                  </Link>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted hover:text-secondary transition-colors"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted hover:text-secondary transition-colors"
                    >
                      <GitFork size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {projects.length > 4 && (
        <AnimatedSection className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl text-secondary text-sm font-medium hover:border-accent hover:text-primary transition-all"
          >
            View all projects <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      )}
    </section>
  );
}
