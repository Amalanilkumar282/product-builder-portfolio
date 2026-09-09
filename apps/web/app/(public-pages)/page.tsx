import type { Metadata } from 'next';
import {
  fetchProfile,
  fetchServices,
  fetchProjects,
  fetchSkills,
  fetchTechStack,
  fetchExperience,
  fetchEducation,
  fetchTestimonials,
  fetchBlogPosts,
  fetchAwards,
  fetchPageSections,
} from '@/lib/api';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TheRecord from '@/components/record/TheRecord';
import Section from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/primitives';
import {
  JsonLd,
  buildOrganizationReference,
  buildPersonSchema,
  buildProfilePageSchema,
  buildWebSiteSchema,
} from '@/lib/entity-jsonld';
import { CANONICAL_NAME, DEFAULT_BIO } from '@/lib/site';
import type { PageSection } from '@/lib/types';

export const metadata: Metadata = {
  title: `${CANONICAL_NAME} | Full-Stack Engineer — Next.js, NestJS, PostgreSQL`,
  description: DEFAULT_BIO,
  alternates: { canonical: '/' },
};

type HomeData = {
  profile: Awaited<ReturnType<typeof fetchProfile>>;
  services: Awaited<ReturnType<typeof fetchServices>>;
  projects: Awaited<ReturnType<typeof fetchProjects>>;
  skills: Awaited<ReturnType<typeof fetchSkills>>;
  techStack: Awaited<ReturnType<typeof fetchTechStack>>;
  experience: Awaited<ReturnType<typeof fetchExperience>>;
  education: Awaited<ReturnType<typeof fetchEducation>>;
  testimonials: Awaited<ReturnType<typeof fetchTestimonials>>;
  blogPosts: Awaited<ReturnType<typeof fetchBlogPosts>>;
  awards: Awaited<ReturnType<typeof fetchAwards>>;
};

/**
 * Section order and visibility come from the DB (`GET /page-sections`), so the
 * homepage can be rearranged from the admin panel without a deploy.
 *
 * `EXPERIENCE` now renders the career density map, and `EDUCATION` and
 * `ACHIEVEMENTS` resolve to `null` because their content is folded into it —
 * disabling any of the three in the admin still behaves sensibly.
 */
const RENDERERS: Record<PageSection['type'], (data: HomeData) => React.ReactNode> = {
  HERO: (d) => <HeroSection profile={d.profile} experience={d.experience} />,

  EXPERIENCE: (d) => (
    <Section
      id="record"
      label="The record"
      meta={`${d.experience.length} roles · ${d.awards.length} awards`}
      title="Everything, on one axis"
      intro="Roles, internships, leadership and recognition plotted against real dates — because a list hides what ran at the same time."
      wide
    >
      <TheRecord
        experience={d.experience}
        awards={d.awards}
        education={d.education}
        projects={d.projects}
      />
    </Section>
  ),

  PROJECTS: (d) => (
    <Section
      id="projects"
      label="Work"
      meta={`${d.projects.length} projects`}
      title="Things I've built"
      railExtra={
        d.projects.length > 6 ? (
          <ButtonLink href="/projects" tone="ghost">
            All projects
          </ButtonLink>
        ) : null
      }
      wide
    >
      <ProjectsSection projects={d.projects} limit={6} />
    </Section>
  ),

  SKILLS: (d) => (
    <Section
      id="skills"
      label="Capability"
      meta={`${d.skills.length} skills`}
      title="What I work with"
      intro="Filter by discipline. Each skill links to the work that evidences it."
      wide
    >
      <SkillsSection skills={d.skills} projects={d.projects} experience={d.experience} />
    </Section>
  ),

  SERVICES: (d) => (
    <Section id="services" label="Services" title="How I can help" wide>
      <ServicesSection services={d.services} />
    </Section>
  ),

  TECH_STACK: (d) => (
    <Section id="tech-stack" label="Stack" meta={`${d.techStack.length} tools`} title="Daily tools" wide>
      <TechStackSection techStack={d.techStack} />
    </Section>
  ),

  BLOG: (d) =>
    d.blogPosts.length === 0 ? null : (
      <Section id="writing" label="Writing" title="Notes" wide>
        <BlogSection posts={d.blogPosts} limit={4} />
      </Section>
    ),

  TESTIMONIALS: (d) =>
    // Renders nothing until a testimonial exists, rather than an empty heading.
    d.testimonials.length === 0 ? null : (
      <Section id="testimonials" label="References" title="What people say" wide>
        <TestimonialsSection testimonials={d.testimonials} />
      </Section>
    ),

  CONTACT: (d) => (
    <Section
      id="contact"
      label="Contact"
      title="Start a conversation"
      intro="Tell me what you're building. I read everything that comes in."
      wide
    >
      <ContactSection profile={d.profile} />
    </Section>
  ),

  // Folded into THE RECORD.
  EDUCATION: () => null,
  ACHIEVEMENTS: () => null,
  ABOUT: () => null,
};

export default async function HomePage() {
  const [
    profile,
    services,
    projects,
    skills,
    techStack,
    experience,
    education,
    testimonials,
    blogPosts,
    awards,
    pageSections,
  ] = await Promise.all([
    fetchProfile(),
    fetchServices(),
    fetchProjects(),
    fetchSkills(),
    fetchTechStack(),
    fetchExperience(),
    fetchEducation(),
    fetchTestimonials(),
    fetchBlogPosts(),
    fetchAwards(),
    fetchPageSections(),
  ]);

  const data: HomeData = {
    profile,
    services,
    projects,
    skills,
    techStack,
    experience,
    education,
    testimonials,
    blogPosts,
    awards,
  };

  /*
   * An empty `page-sections` response used to collapse the homepage to the
   * hero alone. Falling back to the full order keeps the page whole when the
   * API is briefly unreachable.
   */
  const order: PageSection['type'][] =
    pageSections.length > 0
      ? pageSections.map((section) => section.type)
      : ['HERO', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'SERVICES', 'TECH_STACK', 'BLOG', 'CONTACT'];

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteSchema(),
          buildPersonSchema({ profile, experience, education, awards }),
          buildProfilePageSchema({
            path: '/',
            title: `${CANONICAL_NAME} — ${profile?.title ?? 'Full-Stack Engineer'}`,
            description: profile?.bio ?? DEFAULT_BIO,
          }),
          buildOrganizationReference(),
        ]}
      />

      {order.map((type) => {
        const render = RENDERERS[type];
        if (!render) return null;
        const node = render(data);
        return node ? <div key={type}>{node}</div> : null;
      })}
    </>
  );
}
