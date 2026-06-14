import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, GitFork, ArrowLeft } from 'lucide-react';
import { fetchProjects } from '@/lib/api';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';
import { JsonLd, buildProjectListSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of products, tools, and experiments I have built.',
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd data={buildProjectListSchema(projects)} />
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>
        </AnimatedSection>

        <AnimatedSection>
          <SectionHeader
            label="Portfolio"
            title="All Projects"
            subtitle="Products, experiments, and open-source work I'm proud of."
          />
        </AnimatedSection>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted">No projects yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <AnimatedSection key={project.id} delay={i * 0.07}>
                <div className="group relative rounded-2xl overflow-hidden glass hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden shrink-0">
                    {project.coverImageUrl ? (
                      <Image
                        src={project.coverImageUrl}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full gradient-bg opacity-50 flex items-center justify-center">
                        <span className="text-white/20 text-5xl font-bold select-none">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="purple">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>

                    <Link href={`/projects/${project.slug}`}>
                      <h2 className="text-base font-bold text-primary mb-2 hover:text-purple-300 transition-colors line-clamp-2">
                        {project.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">
                      {project.summary}
                    </p>

                    <div className="flex items-center gap-3 pt-3 border-t border-default">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Read more →
                      </Link>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-muted hover:text-secondary transition-colors ml-auto"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-muted hover:text-secondary transition-colors"
                        >
                          <GitFork size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

