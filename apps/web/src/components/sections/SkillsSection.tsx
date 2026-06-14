'use client';

import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { Skill } from '@/lib/types';

interface SkillsSectionProps {
  skills: Skill[];
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      acc[k] = acc[k] ? [...acc[k], item] : [item];
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) return null;
  const grouped = groupBy(skills, 'category');

  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 py-24">
      <div className="w-full h-px gradient-bg opacity-20 mb-24" />

      <AnimatedSection>
        <SectionHeader
          label="Expertise"
          title="Skills & Proficiency"
          subtitle="Technologies and tools I work with every day."
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(grouped).map(([category, categorySkills], i) => (
          <AnimatedSection key={category} delay={i * 0.1}>
            <div className="glass rounded-2xl p-6 hover:border-accent transition-all">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-accent mb-5">
                {category}
              </h3>
              <div className="space-y-4">
                {categorySkills.map((skill, j) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-secondary font-medium">{skill.name}</span>
                      <span className="text-muted">{skill.proficiency}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: j * 0.05, ease: 'easeOut' }}
                        className="h-full rounded-full gradient-bg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
