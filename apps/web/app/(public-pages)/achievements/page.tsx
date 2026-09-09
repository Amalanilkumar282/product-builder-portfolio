import type { Metadata } from 'next';
import { fetchAwards } from '@/lib/api';
import AchievementsSection from '@/components/sections/AchievementsSection';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: { absolute: 'Awards & Achievements | Amal Anilkumar' },
  description:
    'Hackathon wins, awards, recognitions, and milestone achievements earned by Amal Anilkumar across software engineering, AI, and product work.',
  alternates: { canonical: '/achievements' },
  openGraph: {
    type: 'profile',
    url: '/achievements',
    title: 'Awards & Achievements | Amal Anilkumar',
    description:
      'Hackathon wins, awards, recognitions, and milestone achievements across software engineering, AI, and product work.',
  },
};

export default async function AchievementsPage() {
  const awards = await fetchAwards();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <JsonLd
        data={buildCollectionPageSchema({
          path: '/achievements',
          title: 'Achievements',
          description: 'Awards, recognitions, and milestone achievements earned by Amal Anilkumar.',
        })}
      />
      <div className="max-w-7xl mx-auto px-6">
        <AchievementsSection awards={awards} />
      </div>
    </div>
  );
}
