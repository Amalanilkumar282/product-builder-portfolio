import type { Metadata } from 'next';
import Image from 'next/image';
import {
  fetchAwards,
  fetchEducation,
  fetchExperience,
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchTechStack,
} from '@/lib/api';
import TheRecord from '@/components/record/TheRecord';
import SkillsSection from '@/components/sections/SkillsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import Section from '@/components/ui/Section';
import { ButtonLink, DefinitionList } from '@/components/ui/primitives';
import { JsonLd, buildPersonSchema, buildProfilePageSchema } from '@/lib/entity-jsonld';
import {
  CANONICAL_NAME,
  DEFAULT_BIO,
  getProfileBio,
  getProfileLocation,
  getProfileTitle,
} from '@/lib/site';
import { formatMonthYear } from '@/lib/utils';

export const metadata: Metadata = {
  title: { absolute: 'About Amal Anilkumar — Full-Stack & AI Engineer' },
  description:
    'Amal Anilkumar is a full-stack and AI product engineer in Kerala, India, building production web apps, internal tools, and AI-powered backend systems with Next.js and NestJS.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: '/about',
    title: 'About Amal Anilkumar — Full-Stack & AI Engineer',
    description:
      'Full-stack and AI product engineer in Kerala, India, building production web apps, internal tools, and AI-powered backend systems.',
  },
};

export default async function AboutPage() {
  const [profile, experience, education, awards, projects, skills, techStack] =
    await Promise.all([
      fetchProfile(),
      fetchExperience(),
      fetchEducation(),
      fetchAwards(),
      fetchProjects(),
      fetchSkills(),
      fetchTechStack(),
    ]);

  const name = profile?.name?.trim() || CANONICAL_NAME;
  const current = experience.find((role) => role.isPresent);
  const degree = education.find((item) => !/certification/i.test(item.degree));

  return (
    <>
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

      <Section
        id="about"
        label="About"
        meta={getProfileLocation(profile)}
        railExtra={
          profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={`Portrait of ${name}`}
              width={96}
              height={96}
              priority
              sizes="96px"
              className="rounded-lg border border-rule object-cover"
            />
          ) : null
        }
        className="pt-[calc(var(--header-h)+3rem)]"
      >
        <h1 className="measure text-4xl text-ink md:text-5xl">{name}</h1>
        <p className="measure mt-3 text-xl text-ink-dim">{getProfileTitle(profile)}</p>

        {profile?.headline && (
          <p className="measure mt-6 text-lg text-ink">{profile.headline}</p>
        )}
        <p className="measure mt-4 text-ink-dim">{getProfileBio(profile)}</p>

        <div className="mt-8 max-w-md">
          <DefinitionList
            items={[
              current && {
                term: 'Currently',
                value: `${current.role} at ${current.company}, since ${formatMonthYear(current.startDate)}`,
              },
              degree && {
                term: 'Education',
                value: `${degree.degree}, ${degree.institution}`,
              },
              { term: 'Based in', value: getProfileLocation(profile) },
              awards.length > 0 && {
                term: 'Recognition',
                value: `${awards.length} awards, including ${awards[0].title}`,
              },
            ].filter(Boolean) as { term: string; value: string }[]}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" tone="primary">
            Get in touch
          </ButtonLink>
          {profile?.resumeUrl && (
            <ButtonLink
              href={profile.resumeUrl}
              tone="secondary"
              external
              download
              data-analytics="resume_click"
              data-analytics-location="about"
            >
              Download résumé
            </ButtonLink>
          )}
        </div>
      </Section>

      <Section
        id="record"
        label="The record"
        meta={`${experience.length} roles`}
        title="The record"
        wide
      >
        <TheRecord
          experience={experience}
          awards={awards}
          education={education}
          projects={projects}
        />
      </Section>

      <Section id="skills" label="Capability" meta={`${skills.length} skills`} title="Skills" wide>
        <SkillsSection skills={skills} projects={projects} experience={experience} />
      </Section>

      <Section id="tech-stack" label="Stack" title="Daily tools" wide>
        <TechStackSection techStack={techStack} />
      </Section>
    </>
  );
}
