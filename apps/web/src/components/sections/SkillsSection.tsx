'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Chip, EmptyState } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import type { Experience, Project, Skill } from '@/lib/types';

interface SkillsSectionProps {
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
}

/**
 * Normalises a skill or tag name for matching. "Node.js / Express" and
 * "Node.js" should link up; so should "React.js" and "React".
 */
function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[/,]/)
    .map((part) => part.replace(/\.js\b/g, '').replace(/[^a-z0-9+#]/g, '').trim())
    .filter(Boolean);
}

export default function SkillsSection({ skills, projects, experience }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const skill of skills) {
      counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [skills]);

  /*
   * Links each skill to the work that evidences it, by matching the skill name
   * against project tags and role descriptions.
   *
   * This replaces the proficiency percentage bars. A self-reported "React 90%"
   * is unverifiable and technical reviewers discount it; naming the projects a
   * skill actually appears in is both more credible and something a visitor can
   * click through and check.
   */
  const evidence = useMemo(() => {
    const map = new Map<string, { projects: Project[]; roles: Experience[] }>();

    for (const skill of skills) {
      const keys = normalise(skill.name);
      const matchedProjects = projects.filter((project) =>
        project.tags?.some((tag) =>
          normalise(tag.name).some((tagKey) =>
            keys.some((key) => key.length > 2 && (key === tagKey || tagKey.includes(key))),
          ),
        ),
      );

      const haystackRoles = experience.filter((role) => {
        const text = `${role.role} ${role.description}`.toLowerCase();
        return keys.some((key) => key.length > 3 && text.includes(key));
      });

      map.set(skill.id, { projects: matchedProjects, roles: haystackRoles });
    }

    return map;
  }, [skills, projects, experience]);

  const visible = useMemo(
    () => (activeCategory ? skills.filter((s) => s.category === activeCategory) : skills),
    [skills, activeCategory],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, Skill[]>();
    for (const skill of visible) {
      const list = groups.get(skill.category);
      if (list) list.push(skill);
      else groups.set(skill.category, [skill]);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [visible]);

  if (skills.length === 0) {
    return <EmptyState title="No skills published yet" />;
  }

  return (
    <div>
      <div
        className="mb-6 flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter skills by discipline"
      >
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={cn(
            'inline-flex min-h-11 items-center rounded-md border px-3 font-mono text-2xs transition-colors',
            activeCategory === null
              ? 'border-verdigris bg-verdigris-soft text-verdigris'
              : 'border-rule text-ink-faint hover:text-ink-dim',
          )}
        >
          All {skills.length}
        </button>
        {categories.map(([category, count]) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category === activeCategory ? null : category)}
            aria-pressed={category === activeCategory}
            className={cn(
              'inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 font-mono text-2xs transition-colors',
              category === activeCategory
                ? 'border-verdigris bg-verdigris-soft text-verdigris'
                : 'border-rule text-ink-faint hover:text-ink-dim',
            )}
          >
            {category}
            <span className="text-ink-faint">{count}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} skills shown{activeCategory ? ` in ${activeCategory}` : ''}.
      </p>

      <div className="space-y-8">
        {grouped.map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="meta border-b border-rule pb-2 uppercase tracking-[0.14em]">
              {category}
            </h3>
            <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
              {categorySkills.map((skill) => {
                const found = evidence.get(skill.id);
                const usedIn = found?.projects ?? [];
                return (
                  <li
                    key={skill.id}
                    className="flex flex-wrap items-baseline gap-x-2 border-b border-rule/60 pb-2"
                  >
                    <span className="text-sm text-ink">{skill.name}</span>
                    {usedIn.length > 0 ? (
                      <span className="flex flex-wrap items-baseline gap-1">
                        {usedIn.slice(0, 2).map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.slug}`}
                            className="font-mono text-2xs text-verdigris underline decoration-verdigris/40 underline-offset-2 hover:decoration-verdigris"
                          >
                            {project.title.split(/[—–-]/)[0].trim()}
                          </Link>
                        ))}
                        {usedIn.length > 2 && (
                          <span className="meta">+{usedIn.length - 2}</span>
                        )}
                      </span>
                    ) : (
                      found &&
                      found.roles.length > 0 && (
                        <Chip tone="neutral">{found.roles[0].company}</Chip>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
