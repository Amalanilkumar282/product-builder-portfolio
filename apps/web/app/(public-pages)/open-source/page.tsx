import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProjects } from '@/lib/api';
import { JsonLd, buildOpenSourceCollectionSchema } from '@/lib/entity-jsonld';
import { GitHubIcon } from '@/components/icons/SocialIcons';

export const metadata: Metadata = {
  title: 'Open Source',
  description: 'Open-source projects, public repositories, and build notes from Amal Anilkumar.',
  alternates: { canonical: '/open-source' },
};

export default async function OpenSourcePage() {
  const projects = (await fetchProjects()).filter((project) => Boolean(project.githubUrl));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd data={buildOpenSourceCollectionSchema(projects)} />
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-3">
            Open Source
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Public Code and Build Notes</h1>
          <p className="text-secondary text-lg">
            Public repositories and implementation-focused project pages that show how Amal Anilkumar builds software.
          </p>
        </div>
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-2xl p-6 border border-default">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-primary">{project.title}</p>
                  <p className="text-sm text-secondary mt-2">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag.id} className="text-xs px-2 py-1 rounded-full border border-default text-secondary">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-xl text-secondary hover:text-primary"
                    aria-label={`Open ${project.title} on GitHub`}
                  >
                    <GitHubIcon width={18} height={18} />
                  </a>
                )}
              </div>
              <div className="mt-5">
                <Link href={`/projects/${project.slug}`} className="text-sm text-accent hover:text-accent-muted">
                  Read the project page
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
