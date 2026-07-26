import type { Metadata } from 'next';
import { fetchExperience, fetchProfile } from '@/lib/api';
import ExperienceSection from '@/components/sections/ExperienceSection';
import { JsonLd, buildCollectionPageSchema, buildPersonSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Work history, internships, leadership roles, and engineering experience of Amal Anilkumar.',
  alternates: { canonical: '/experience' },
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
