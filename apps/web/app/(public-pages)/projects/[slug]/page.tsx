import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, GitFork, ArrowLeft, Calendar } from 'lucide-react';
import { fetchProject, fetchProjects, fetchServices } from '@/lib/api';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import MarkdownContent from '@/components/content/MarkdownContent';
import { JsonLd, buildProjectSchema, buildBreadcrumbSchema } from '@/lib/entity-jsonld';
import { SITE_URL } from '@/lib/site';

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
  const [project, services, projects] = await Promise.all([
    fetchProject(slug),
    fetchServices(),
    fetchProjects(),
  ]);
  if (!project) notFound();

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .filter((item) => item.tags.some((tag) => project.tags.some((projectTag) => projectTag.slug === tag.slug)))
    .slice(0, 3);
  const relatedServices = services
    .filter((service) =>
      service.tags.some((tag) => project.tags.some((projectTag) => projectTag.slug === tag.slug)),
    )
    .slice(0, 3);

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

          <div className="glass rounded-2xl p-5 mb-8 border border-accent">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              AI-Readable Summary
            </p>
            <p className="text-sm text-secondary leading-relaxed">
              {project.title} is a project by Amal Anilkumar. It focuses on {project.industry ?? 'software product development'} using {project.stackSummary ?? 'a modern TypeScript stack'}. This page documents the build context, technical approach, and outcome.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 gradient-bg px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent"
              >
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-xl text-secondary text-sm font-semibold hover:border-accent hover:text-primary transition-all"
              >
                <GitFork size={15} /> Source Code
              </a>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted ml-auto">
              <Calendar size={13} /> {formatDate(project.createdAt)}
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass rounded-2xl p-8 md:p-10">
            <MarkdownContent className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-code:text-purple-300 prose-pre:bg-elevated prose-pre:border prose-pre:border-default" content={project.content} />
          </div>
        </AnimatedSection>

        {(relatedServices.length > 0 || relatedProjects.length > 0) && (
          <AnimatedSection delay={0.15} className="mt-10 grid gap-6 md:grid-cols-2">
            {relatedServices.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                  Related Services
                </p>
                <div className="grid gap-3">
                  {relatedServices.map((service) => (
                    <a
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="rounded-xl border border-default px-4 py-3 hover:border-accent transition-colors"
                    >
                      <p className="text-sm font-semibold text-primary">{service.title}</p>
                      <p className="text-sm text-secondary">{service.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {relatedProjects.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                  Related Work
                </p>
                <div className="grid gap-3">
                  {relatedProjects.map((item) => (
                    <a
                      key={item.id}
                      href={`/projects/${item.slug}`}
                      className="rounded-xl border border-default px-4 py-3 hover:border-accent transition-colors"
                    >
                      <p className="text-sm font-semibold text-primary">{item.title}</p>
                      <p className="text-sm text-secondary">{item.summary}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}


