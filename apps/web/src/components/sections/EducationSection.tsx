import Image from 'next/image';
import { GraduationCap, Award } from 'lucide-react';
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

  const degrees = education.filter((e) => e.degree !== 'Certification');
  const certifications = education.filter((e) => e.degree === 'Certification');

  return (
    <section id="education" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader label="Background" title="Education" />
      </AnimatedSection>

      {/* Degrees */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {degrees.map((edu, i) => (
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
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0">
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

      {/* Certifications */}
      {certifications.length > 0 && (
        <AnimatedSection>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6 ml-1">
            Certifications &amp; Courses
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <AnimatedSection key={cert.id} delay={i * 0.07}>
                <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-purple-500/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Award size={14} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{cert.field}</p>
                    <p className="text-xs text-slate-500 truncate">{cert.institution}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      )}
    </section>
  );
}

