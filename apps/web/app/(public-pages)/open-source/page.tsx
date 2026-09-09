import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProjects } from '@/lib/api';
import Section from '@/components/ui/Section';
import { ButtonLink, Chip, EmptyState } from '@/components/ui/primitives';
import { GitHubIcon } from '@/components/icons/SocialIcons';
import { JsonLd, buildOpenSourceCollectionSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Open Source Projects | Amal Anilkumar' },
  description:
    'Public repositories and open-source work by Amal Anilkumar — source code, build notes, and the stack behind each project, all available on GitHub.',
  alternates: { canonical: '/open-source' },
  openGraph: {
    type: 'website',
    url: '/open-source',
    title: 'Open Source Projects | Amal Anilkumar',
    description:
      'Public repositories and open-source work — source code, build notes, and the stack behind each project.',
  },
};

export default async function OpenSourcePage() {
  const projects = (await fetchProjects()).filter((project) => Boolean(project.githubUrl));

  return (
    <>
      <JsonLd data={buildOpenSourceCollectionSchema(projects)} />
      <Section
        id="open-source"
        label="Open source"
        meta={`${projects.length} ${projects.length === 1 ? 'repository' : 'repositories'}`}
        title="Public code"
        as="h1"
        intro="Repositories and implementation notes for the work that's open."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        {projects.length === 0 ? (
          /*
           * This page filters on `githubUrl`, which is currently empty on every
           * project — so without a real empty state it rendered as a heading
           * above nothing. Adding a repository URL in the admin panel makes an
           * entry appear here automatically.
           */
          <EmptyState
            title="No public repositories linked yet"
            description="Projects appear here once a repository URL is added. In the meantime, the case studies cover the architecture in detail."
            action={
              <ButtonLink href="/projects" tone="secondary">
                Read the case studies
              </ButtonLink>
            }
          />
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {projects.map((project) => (
              <li key={project.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg text-ink">
                    <Link href={`/projects/${project.slug}`} className="hover:text-verdigris">
                      {project.title}
                    </Link>
                  </h2>
                  <p className="measure mt-1 text-sm text-ink-dim">{project.summary}</p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tags.slice(0, 5).map((tag) => (
                        <Chip key={tag.id}>{tag.name}</Chip>
                      ))}
                    </div>
                  )}
                </div>
                <ButtonLink
                  href={project.githubUrl as string}
                  tone="secondary"
                  external
                  aria-label={`Source code for ${project.title} on GitHub`}
                  className="shrink-0"
                >
                  <GitHubIcon width={14} height={14} aria-hidden="true" /> Repository
                </ButtonLink>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
