import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, GitFork, ArrowLeft, Calendar } from 'lucide-react';
import { fetchProject, fetchProjects } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { JsonLd, buildProjectSchema, buildBreadcrumbSchema } from '@/lib/jsonld';

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
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
  const ogImage = project.coverImageUrl ?? `${SITE_URL}/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.summary ?? '')}&type=project`;
  return {
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary,
    alternates: { canonical: `${SITE_URL}/projects/${slug}` },
    openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [ogImage] },
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

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd data={[
        buildProjectSchema(project),
        buildBreadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Projects', url: `${SITE_URL}/projects` },
          { name: project.title, url: `${SITE_URL}/projects/${project.slug}` },
        ]),
      ]} />
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-secondary transition-colors group"
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

          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {project.title}
          </h1>

          <p className="text-secondary text-lg mb-6">{project.summary}</p>

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
                className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-secondary text-sm font-semibold hover:border-purple-500/30 hover:text-primary transition-all"
              >
                <GitFork size={15} /> Source Code
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted ml-auto">
              <Calendar size={13} /> {formatDate(project.createdAt)}
            </span>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-code:text-purple-300 prose-pre:bg-elevated prose-pre:border prose-pre:border-default">
              {project.content}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

