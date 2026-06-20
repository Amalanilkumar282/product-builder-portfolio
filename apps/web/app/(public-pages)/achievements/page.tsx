import type { Metadata } from 'next';
import { fetchAwards } from '@/lib/api';
import AchievementsSection from '@/components/sections/AchievementsSection';
import { JsonLd, buildCollectionPageSchema } from '@/lib/entity-jsonld';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Awards, recognitions, and milestone achievements of Amal Anilkumar.',
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
