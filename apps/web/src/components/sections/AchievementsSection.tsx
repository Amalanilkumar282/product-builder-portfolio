import { Trophy } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { Award } from '@/lib/types';

interface AchievementsSectionProps {
  awards: Award[];
}

export default function AchievementsSection({ awards }: AchievementsSectionProps) {
  if (awards.length === 0) return null;

  return (
    <section id="achievements" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

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
            <GlassCard className="h-full group hover:border-purple-500/25 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Trophy size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                      {award.year}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-primary mt-2 mb-1 leading-snug">
                    {award.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium mb-2">{award.issuer}</p>
                  {award.description && (
                    <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
