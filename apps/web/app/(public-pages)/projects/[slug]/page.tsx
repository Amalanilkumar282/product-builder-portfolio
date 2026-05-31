import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, GitFork, ArrowLeft, Calendar } from 'lucide-react';
import { fetchProject, fetchProjects } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const projects = await fetchProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);
  if (!project) return {};
  return {
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All projects
          </Link>
        </AnimatedSection>

        {/* Cover image */}
        {project.coverImageUrl && (
          <AnimatedSection className="mb-8">
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src={project.coverImageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection>
          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag.id} variant="purple">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-400 text-lg mb-6">{project.summary}</p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 gradient-bg px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
              >
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-slate-300 text-sm font-semibold hover:border-purple-500/30 hover:text-white transition-all"
              >
                <GitFork size={15} /> Source Code
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
              <Calendar size={13} /> {formatDate(project.createdAt)}
            </span>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-code:text-purple-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10">
              {project.content}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

