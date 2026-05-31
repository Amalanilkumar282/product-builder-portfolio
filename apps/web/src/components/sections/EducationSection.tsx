import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { formatDateRange } from '@/lib/utils';
import type { Education } from '@/lib/types';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader label="Background" title="Education" />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {education.map((edu, i) => (
          <AnimatedSection key={edu.id} delay={i * 0.1}>
            <GlassCard className="h-full">
              <div className="flex items-center gap-3 mb-4">
                {edu.logoUrl ? (
                  <Image
                    src={edu.logoUrl}
                    alt={edu.institution}
                    width={44}
                    height={44}
                    className="rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-100 text-sm">{edu.institution}</p>
                  <p className="text-xs text-slate-500">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-purple-300 font-medium mb-1">{edu.degree}</p>
              <p className="text-xs text-slate-400">{edu.field}</p>
            </GlassCard>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
