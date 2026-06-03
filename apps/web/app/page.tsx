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

export const metadata: Metadata = {
  title: 'Amal A \u2014 Product Builder \u0026 Full-Stack Engineer',
  description:
    'Full-stack and mobile engineer who builds complete, production-ready products \u2014 web apps, mobile, enterprise tools, and AI integrations. Based in Kerala, India.',
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
  ]);

  return (
    <>
      <HeroSection profile={profile} />
      <StatsBar />
      <ServicesSection services={services} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <TechStackSection techStack={techStack} />
      <ExperienceSection experience={experience} />
      <EducationSection education={education} />
      <AchievementsSection awards={awards} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={blogPosts} />
      <ContactSection profile={profile} />
    </>
  );
}
