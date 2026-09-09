import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/SocialIcons';
import { fetchProject, fetchProjects, fetchServices } from '@/lib/api';
import MarkdownContent from '@/components/content/MarkdownContent';
import { ButtonLink, Chip, DefinitionList, Rule } from '@/components/ui/primitives';
import { JsonLd, buildProjectSchema, buildBreadcrumbSchema } from '@/lib/entity-jsonld';
import { SITE_URL, buildPageTitle } from '@/lib/site';
import { parseStringArray } from '@/lib/utils';

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

  const ogImage =
    project.coverImageUrl ??
    `${SITE_URL}/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(
      project.summary ?? '',
    )}&type=project`;
  const title = buildPageTitle(project.seoTitle ?? project.title);
  const description = project.seoDescription ?? project.summary;
  const url = `${SITE_URL}/projects/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
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

  const gallery = parseStringArray(project.gallery);
  const authoredServiceSlugs = parseStringArray(project.relatedServiceSlugs);

  /*
   * Prefer the slugs authored in the admin panel; fall back to tag overlap.
   * The previous page ignored `relatedServiceSlugs` entirely and always
   * inferred by tag, so the authored field had no effect.
   */
  const relatedServices = authoredServiceSlugs.length
    ? services.filter((service) => authoredServiceSlugs.includes(service.slug))
    : services
        .filter((service) =>
          service.tags?.some((tag) => project.tags?.some((t) => t.id === tag.id)),
        )
        .slice(0, 3);

  const relatedProjects = projects
    .filter(
      (other) =>
        other.id !== project.id &&
        other.tags?.some((tag) => project.tags?.some((t) => t.id === tag.id)),
    )
    .slice(0, 3);

  /* Every one of these columns exists in the schema and was rendered nowhere. */
  const facts = [
    { term: 'Role', value: project.role },
    { term: 'Client', value: project.clientName },
    { term: 'Duration', value: project.duration },
    { term: 'Status', value: project.status },
    { term: 'Industry', value: project.industry },
    { term: 'Stack', value: project.stackSummary },
  ];

  const narrative = [
    { heading: 'The challenge', body: project.challenge },
    { heading: 'Approach', body: project.approach },
    { heading: 'Outcome', body: project.outcome },
  ].filter((block) => block.body);

  return (
    <>
      <JsonLd
        data={[
          buildProjectSchema(project),
          buildBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Projects', url: `${SITE_URL}/projects` },
            { name: project.title, url: `${SITE_URL}/projects/${slug}` },
          ]),
        ]}
      />

      <article className="shell py-[calc(var(--header-h)+3rem)]">
        <Link
          href="/projects"
          className="meta inline-flex min-h-11 items-center gap-2 hover:text-verdigris"
        >
          <ArrowLeft size={13} aria-hidden="true" /> All projects
        </Link>

        <div className="rail-grid mt-6">
          {/* Metadata rail */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <DefinitionList items={facts} />

            {project.tags && project.tags.length > 0 && (
              <div className={facts.some((f) => f.value) ? 'mt-5' : undefined}>
                <p className="meta uppercase tracking-[0.14em]">Tagged</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Chip key={tag.id}>{tag.name}</Chip>
                  ))}
                </div>
              </div>
            )}

            {(project.demoUrl || project.githubUrl) && (
              <div className="mt-5 flex flex-col gap-2">
                {project.demoUrl && (
                  <ButtonLink href={project.demoUrl} tone="secondary" external>
                    <ExternalLink size={14} aria-hidden="true" /> Live demo
                  </ButtonLink>
                )}
                {project.githubUrl && (
                  <ButtonLink href={project.githubUrl} tone="secondary" external>
                    <GitHubIcon width={14} height={14} aria-hidden="true" /> Source
                  </ButtonLink>
                )}
              </div>
            )}
          </aside>

          <div className="min-w-0">
            <h1 className="measure text-4xl text-ink md:text-5xl">{project.title}</h1>
            <p className="measure mt-4 text-lg text-ink-dim">{project.summary}</p>

            {project.coverImageUrl && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-lg border border-rule">
                <Image
                  src={project.coverImageUrl}
                  alt={`${project.title} interface`}
                  fill
                  // The LCP element on this route; it previously lazy-loaded.
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            )}

            {project.metrics && (
              <div className="mt-8 rounded-lg border border-copper/30 bg-copper-soft p-4">
                <p className="meta uppercase tracking-[0.14em] text-copper">Results</p>
                <p className="mt-1.5 text-sm text-ink">{project.metrics}</p>
              </div>
            )}

            {narrative.length > 0 && (
              <div className="mt-10 space-y-8">
                {narrative.map((block) => (
                  <section key={block.heading}>
                    <h2 className="text-2xl text-ink">{block.heading}</h2>
                    <div className="mt-3">
                      <MarkdownContent content={block.body as string} />
                    </div>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-10">
              <MarkdownContent content={project.content} />
            </div>

            {gallery.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl text-ink">Gallery</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {gallery.map((src, index) => (
                    <li
                      key={src}
                      className="relative aspect-video overflow-hidden rounded-md border border-rule"
                    >
                      <Image
                        src={src}
                        alt={`${project.title} screenshot ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 45vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(relatedProjects.length > 0 || relatedServices.length > 0) && (
              <>
                <Rule className="mt-12" />
                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  {relatedProjects.length > 0 && (
                    <div>
                      <h2 className="meta uppercase tracking-[0.14em]">Related work</h2>
                      <ul className="mt-2 divide-y divide-rule border-t border-rule">
                        {relatedProjects.map((other) => (
                          <li key={other.id}>
                            <Link
                              href={`/projects/${other.slug}`}
                              className="flex min-h-11 items-center py-2 text-sm text-ink-dim hover:text-verdigris"
                            >
                              {other.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {relatedServices.length > 0 && (
                    <div>
                      <h2 className="meta uppercase tracking-[0.14em]">Related services</h2>
                      <ul className="mt-2 divide-y divide-rule border-t border-rule">
                        {relatedServices.map((service) => (
                          <li key={service.id}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="flex min-h-11 items-center py-2 text-sm text-ink-dim hover:text-verdigris"
                            >
                              {service.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
