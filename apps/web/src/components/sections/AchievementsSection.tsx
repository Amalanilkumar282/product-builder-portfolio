import { Trophy } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionConnector from '@/components/ui/SectionConnector';
import type { Award } from '@/lib/types';

interface AchievementsSectionProps {
  awards: Award[];
}

function AwardCardFront({ award }: { award: Award }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
        <Trophy size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-light text-accent border border-accent">
            {award.year}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-primary mt-2 mb-1 leading-snug">
          {award.title}
        </h3>
        <p className="text-xs text-accent font-medium">{award.issuer}</p>
      </div>
    </div>
  );
}

export default function AchievementsSection({ awards }: AchievementsSectionProps) {
  if (awards.length === 0) return null;

  return (
    <section id="achievements" className="max-w-7xl mx-auto px-6 py-24">
      <SectionConnector />

      <AnimatedSection>
        <SectionHeader
          label="Recognition"
          title="Awards & Achievements"
          subtitle="Milestones that reflect the work, not just the title."
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award, i) => (
          <AnimatedSection key={award.id} delay={i * 0.1}>
            {award.description ? (
              <button
                type="button"
                className="group block h-full w-full rounded-2xl text-left perspective-1000 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`${award.title} — hover or focus for details`}
              >
                <div className="relative h-full min-h-[172px] preserve-3d transition-transform duration-500 group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]">
                  <div className="backface-hidden absolute inset-0">
                    <GlassCard className="h-full">
                      <AwardCardFront award={award} />
                    </GlassCard>
                  </div>
                  <div className="backface-hidden absolute inset-0 [transform:rotateY(180deg)]">
                    <GlassCard hover={false} className="h-full flex flex-col justify-center">
                      <p className="text-xs font-semibold text-accent mb-2">{award.title}</p>
                      <p className="text-xs text-secondary leading-relaxed">{award.description}</p>
                    </GlassCard>
                  </div>
                </div>
              </button>
            ) : (
              <GlassCard className="h-full group hover:border-accent transition-all">
                <AwardCardFront award={award} />
              </GlassCard>
            )}
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}



