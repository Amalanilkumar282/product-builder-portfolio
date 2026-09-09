import type { Metadata } from 'next';
import { fetchProjects } from '@/lib/api';
import ProjectsSection from '@/components/sections/ProjectsSection';
import Section from '@/components/ui/Section';
import { JsonLd, buildCollectionPageSchema, buildProjectListSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Projects by Amal Anilkumar — Full-Stack & AI Builds' },
  description:
    'Case studies of web apps, AI tools, and internal platforms built by Amal Anilkumar with Next.js, NestJS, TypeScript, and Python — with the stack and outcome for each build.',
  alternates: { canonical: '/projects' },
  openGraph: {
    type: 'website',
    url: '/projects',
    title: 'Projects by Amal Anilkumar — Full-Stack & AI Builds',
    description:
      'Case studies of web apps, AI tools, and internal platforms built with Next.js, NestJS, TypeScript, and Python.',
  },
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageSchema({
            path: '/projects',
            title: 'Projects',
            description:
              'Case studies, products, open-source work, and engineering experiments by Amal Anilkumar.',
          }),
          buildProjectListSchema(projects),
        ]}
      />
      <Section
        id="projects"
        label="Work"
        meta={`${projects.length} projects`}
        title="Projects"
        as="h1"
        intro="Filter by technology to narrow the list."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        <ProjectsSection projects={projects} />
      </Section>
    </>
  );
}
