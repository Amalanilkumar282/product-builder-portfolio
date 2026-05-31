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
} from '@/lib/api';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';

export const metadata: Metadata = {
  title: 'Amal Anilkumar â€” Software Engineer',
  description:
    'Full-stack software engineer passionate about building scalable products where tech and nature thrive together.',
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
  ]);

  return (
    <>
      <HeroSection profile={profile} />
      <ServicesSection services={services} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <TechStackSection techStack={techStack} />
      <ExperienceSection experience={experience} />
      <EducationSection education={education} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={blogPosts} />
      <ContactSection profile={profile} />
    </>
  );
}
