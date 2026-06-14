import Image from 'next/image';
import { MapPin, Calendar, Briefcase, GraduationCap, Code2, Users } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { formatDateRange } from '@/lib/utils';
import type { Experience, ExperienceType } from '@/lib/types';

interface ExperienceSectionProps {
  experience: Experience[];
}

const TYPE_CONFIG: Record<
  ExperienceType,
  { label: string; className: string; Icon: React.ElementType }
> = {
  WORK: {
    label: 'Full-Time',
    className: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/25',
    Icon: Briefcase,
  },
  INTERNSHIP: {
    label: 'Internship',
    className: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/25',
    Icon: GraduationCap,
  },
  FREELANCE: {
    label: 'Freelance',
    className: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/25',
    Icon: Code2,
  },
  LEADERSHIP: {
    label: 'Leadership',
    className: 'bg-accent-light text-accent border border-accent',
    Icon: Users,
  },
};

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  const professional = experience.filter(
    (e) => e.experienceType === 'WORK' || e.experienceType === 'INTERNSHIP' || e.experienceType === 'FREELANCE',
  );
  const leadership = experience.filter((e) => e.experienceType === 'LEADERSHIP');

  const renderTimeline = (items: Experience[]) => (
    <div className="relative">
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px gradient-bg opacity-30" />
      <div className="space-y-8">
        {items.map((exp, i) => {
          const typeConfig = TYPE_CONFIG[exp.experienceType ?? 'WORK'];
          const TypeIcon = typeConfig.Icon;
          return (
            <AnimatedSection key={exp.id} delay={i * 0.1} direction="left">
              <div className="relative pl-16 md:pl-20">
                <div className="absolute left-3 md:left-5 top-5 w-5 h-5 rounded-full gradient-bg border-2 border-slate-950 glow-purple" />
                <div className="glass rounded-2xl p-6 hover:border-accent hover:shadow-lg hover:shadow-accent transition-all">
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
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {exp.company.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-primary">{exp.role}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.className}`}
                          >
                            <TypeIcon size={10} />
                            {typeConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-accent">{exp.company}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap shrink-0">
                      <Calendar size={12} />
                      {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Career"
          title="Work Experience"
          subtitle="Where I've worked, what I've built, and how I've led."
        />
      </AnimatedSection>

      <div className="space-y-16">
        {professional.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-8 ml-1">
              Professional
            </h3>
            {renderTimeline(professional)}
          </div>
        )}

        {leadership.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-8 ml-1">
              Leadership &amp; Positions of Responsibility
            </h3>
            {renderTimeline(leadership)}
          </div>
        )}
      </div>
    </section>
  );
}



