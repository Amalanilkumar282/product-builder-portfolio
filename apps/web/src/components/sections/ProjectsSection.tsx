'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/SocialIcons';
import { Chip, EmptyState, Button } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
  /** Homepage shows a subset; the /projects route passes false. */
  limit?: number;
}

/**
 * Tag filtering happens here, in the browser, because no list endpoint on the
 * API accepts a query parameter — every public controller method takes zero
 * arguments. With seven projects and twenty-two tags the whole set is already
 * in memory, so client-side narrowing is both correct and instant.
 */
export default function ProjectsSection({ projects, limit }: ProjectsSectionProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tag of project.tags ?? []) {
        counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1);
      }
    }
    // Most-used first, then alphabetical — a stable order that puts the
    // genuinely useful filters at the front.
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [projects]);

  const filtered = useMemo(() => {
    const matching = activeTag
      ? projects.filter((project) => project.tags?.some((tag) => tag.name === activeTag))
      : projects;
    return limit ? matching.slice(0, limit) : matching;
  }, [projects, activeTag, limit]);

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects published yet"
        description="Work in progress — check back shortly, or get in touch directly."
      />
    );
  }

  return (
    <div>
      {tags.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by technology">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={cn(
              'inline-flex min-h-11 items-center rounded-md border px-3 font-mono text-2xs transition-colors',
              activeTag === null
                ? 'border-verdigris bg-verdigris-soft text-verdigris'
                : 'border-rule text-ink-faint hover:text-ink-dim',
            )}
          >
            All {projects.length}
          </button>
          {tags.map((tag) => (
            <button
              key={tag.name}
              type="button"
              onClick={() => setActiveTag(tag.name === activeTag ? null : tag.name)}
              aria-pressed={tag.name === activeTag}
              className={cn(
                'inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 font-mono text-2xs transition-colors',
                tag.name === activeTag
                  ? 'border-verdigris bg-verdigris-soft text-verdigris'
                  : 'border-rule text-ink-faint hover:text-ink-dim',
              )}
            >
              {tag.name}
              <span className="text-ink-faint">{tag.count}</span>
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} shown
        {activeTag ? `, filtered by ${activeTag}` : ''}.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No projects tagged "${activeTag}"`}
          description="That combination has nothing in it yet."
          action={
            <Button onClick={() => setActiveTag(null)} tone="secondary">
              Clear filter
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <li key={project.id} className="group relative flex flex-col bg-surface p-5">
              {/* Cover art is optional by design: none of the current records
                  have one, so the card is built to read well as pure
                  typography and simply gains an image when one is uploaded. */}
              {project.coverImageUrl && (
                <div className="relative mb-4 aspect-video overflow-hidden rounded-md border border-rule">
                  <Image
                    src={project.coverImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}

              <h3 className="text-lg text-ink">
                <Link
                  href={`/projects/${project.slug}`}
                  // Stretched link: the whole card is the target, so the tap
                  // area comfortably exceeds the 44px minimum.
                  className="before:absolute before:inset-0 before:content-[''] group-hover:text-verdigris"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="mt-2 flex-1 text-sm text-ink-dim">{project.summary}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Chip key={tag.id}>{tag.name}</Chip>
                  ))}
                </div>
              )}

              {(project.demoUrl || project.githubUrl) && (
                <div className="relative z-10 mt-4 flex items-center gap-1 border-t border-rule pt-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo of ${project.title}`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 font-mono text-2xs text-ink-dim hover:text-verdigris"
                    >
                      <ExternalLink size={13} aria-hidden="true" /> Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Source code for ${project.title}`}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 font-mono text-2xs text-ink-dim hover:text-verdigris"
                    >
                      <GitHubIcon width={13} height={13} aria-hidden="true" /> Code
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
