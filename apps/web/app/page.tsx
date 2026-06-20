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
import StatsBar from '@/components/ui/StatsBar';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  title: 'Amal Anilkumar | Product Builder, Full-Stack and AI Engineer',
  description: DEFAULT_BIO,
};

const sectionRenderers: Record<PageSection['type'], (data: HomePageData) => React.ReactNode> = {
  HERO: (data) => (
    <>
      <HeroSection profile={data.profile} />
      <StatsBar />
    </>
  ),
  SERVICES: (data) => <ServicesSection services={data.services} />,
  PROJECTS: (data) => <ProjectsSection projects={data.projects} />,
  SKILLS: (data) => <SkillsSection skills={data.skills} />,
  EXPERIENCE: (data) => <ExperienceSection experience={data.experience} />,
  EDUCATION: (data) => <EducationSection education={data.education} />,
  TESTIMONIALS: (data) => <TestimonialsSection testimonials={data.testimonials} />,
  TECH_STACK: (data) => <TechStackSection techStack={data.techStack} />,
  BLOG: (data) => <BlogSection posts={data.blogPosts} />,
  CONTACT: (data) => <ContactSection profile={data.profile} />,
  ABOUT: () => null,
  ACHIEVEMENTS: (data) => <AchievementsSection awards={data.awards} />,
};

interface HomePageData {
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
  pageSections: Awaited<ReturnType<typeof fetchPageSections>>;
}

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

  const pageData: HomePageData = {
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
  };

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteSchema(),
          buildOrganizationReference(),
          buildProfilePageSchema({
            path: '/',
            title: `${CANONICAL_NAME} Portfolio`,
            description: DEFAULT_BIO,
          }),
          buildPersonSchema({ profile, experience, education, awards }),
        ]}
      />
      <Navbar ownerName={profile?.name ?? CANONICAL_NAME} />
      <main>
        {(pageSections.length ? pageSections : [{ type: 'HERO' } as PageSection]).map((section) => (
          <div key={section.type}>
            {sectionRenderers[section.type]?.(pageData) ?? null}
          </div>
        ))}
      </main>
      <Footer profile={profile} />
    </>
  );
}
