import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  fetchAwards,
  fetchEducation,
  fetchExperience,
  fetchProfile,
  fetchProjects,
} from '@/lib/api';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import { JsonLd, buildPersonSchema, buildProfilePageSchema } from '@/lib/entity-jsonld';
import { CANONICAL_NAME, DEFAULT_BIO, DEFAULT_LOCATION, DEFAULT_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Amal Anilkumar, a full-stack and AI product engineer based in Kerala, India.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const [profile, experience, education, awards, projects] = await Promise.all([
    fetchProfile(),
    fetchExperience(),
    fetchEducation(),
    fetchAwards(),
    fetchProjects(),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd
        data={[
          buildProfilePageSchema({
            path: '/about',
            title: `About ${CANONICAL_NAME}`,
            description: profile?.bio ?? DEFAULT_BIO,
          }),
          buildPersonSchema({ profile, experience, education, awards }),
        ]}
      />
      <div className="max-w-7xl mx-auto px-6">
        <section className="glass rounded-[2rem] p-8 md:p-12 border border-accent mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">
            About the Engineer
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight mb-4">
            {profile?.name ?? CANONICAL_NAME}
          </h1>
          <p className="text-lg text-secondary mb-3">
            {profile?.title ?? DEFAULT_TITLE} · {profile?.location ?? DEFAULT_LOCATION}
          </p>
          <p className="max-w-3xl text-secondary text-base md:text-lg leading-relaxed mb-6">
            {profile?.bio ?? DEFAULT_BIO}
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-secondary">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Current Focus</p>
              <p>Scalable product builds, internal tools, admin platforms, and AI-assisted software systems.</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Primary Stack</p>
              <p>Next.js, NestJS, TypeScript, PostgreSQL, Cloudinary, and modern deployment workflows.</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Work Style</p>
              <p>Hands-on architecture, shipping-oriented execution, and technical communication built for clients.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 gradient-bg px-5 py-3 rounded-xl text-white text-sm font-semibold"
            >
              View Case Studies <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 glass px-5 py-3 rounded-xl text-secondary text-sm font-semibold"
            >
              Start a Conversation <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <AchievementsSection awards={awards} />
        <ProjectsSection projects={projects.slice(0, 4)} />
      </div>
    </div>
  );
}
