import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { formatDateRange } from '@/lib/utils';
import type { Experience } from '@/lib/types';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Career"
          title="Work Experience"
          subtitle="Where I've worked and what I've built."
        />
      </AnimatedSection>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px gradient-bg opacity-30" />

        <div className="space-y-10">
          {experience.map((exp, i) => (
            <AnimatedSection key={exp.id} delay={i * 0.1} direction="left">
              <div className="relative pl-16 md:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-3 md:left-5 top-5 w-5 h-5 rounded-full gradient-bg border-2 border-slate-950 glow-purple" />

                <div className="glass rounded-2xl p-6 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {exp.logoUrl ? (
                        <Image
                          src={exp.logoUrl}
                          alt={exp.company}
                          width={40}
                          height={40}
                          className="rounded-xl object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm">
                          {exp.company.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">{exp.role}</h3>
                        <p className="text-sm text-purple-400">{exp.company}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
                      <Calendar size={12} />
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
