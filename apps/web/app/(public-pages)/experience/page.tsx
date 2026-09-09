import type { Metadata } from 'next';
import { fetchExperience, fetchProfile } from '@/lib/api';
import ExperienceSection from '@/components/sections/ExperienceSection';
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
  const [profile, experience] = await Promise.all([fetchProfile(), fetchExperience()]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd
        data={[
          buildCollectionPageSchema({
            path: '/experience',
            title: 'Experience',
            description: 'Professional, freelance, internship, and leadership experience of Amal Anilkumar.',
          }),
          buildPersonSchema({ profile, experience }),
        ]}
      />
      <div className="max-w-7xl mx-auto px-6">
        <ExperienceSection experience={experience} />
      </div>
    </div>
  );
}
