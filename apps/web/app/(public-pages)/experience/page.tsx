import type { Metadata } from 'next';
import {
  fetchAwards,
  fetchEducation,
  fetchExperience,
  fetchProfile,
  fetchProjects,
} from '@/lib/api';
import TheRecord from '@/components/record/TheRecord';
import Section from '@/components/ui/Section';
import { JsonLd, buildCollectionPageSchema, buildPersonSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Experience — Amal Anilkumar, Full-Stack Engineer' },
  description:
    'The work history of Amal Anilkumar: engineering roles, internships, and leadership positions, with the products shipped and the technologies used in each.',
  alternates: { canonical: '/experience' },
  openGraph: {
    type: 'profile',
    url: '/experience',
    title: 'Experience — Amal Anilkumar, Full-Stack Engineer',
    description:
      'Engineering roles, internships, and leadership positions, with the products shipped and technologies used in each.',
  },
};

export default async function ExperiencePage() {
  const [profile, experience, awards, education, projects] = await Promise.all([
    fetchProfile(),
    fetchExperience(),
    fetchAwards(),
    fetchEducation(),
    fetchProjects(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageSchema({
            path: '/experience',
            title: 'Experience',
            description:
              'Professional, freelance, internship, and leadership experience of Amal Anilkumar.',
          }),
          buildPersonSchema({ profile, experience, education, awards }),
        ]}
      />
      <Section
        id="record"
        label="The record"
        meta={`${experience.length} roles`}
        title="The record"
        as="h1"
        intro="Every role, internship, leadership post and award on one axis — so what overlapped is visible rather than buried in a list."
        className="pt-[calc(var(--header-h)+3rem)]"
        wide
      >
        <TheRecord
          experience={experience}
          awards={awards}
          education={education}
          projects={projects}
        />
      </Section>
    </>
  );
}
