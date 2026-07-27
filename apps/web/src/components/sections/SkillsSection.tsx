'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionConnector from '@/components/ui/SectionConnector';
import Tilt3D from '@/components/ui/Tilt3D';
import SceneCanvas from '@/components/3d/SceneCanvas';
import OrbitField from '@/components/3d/OrbitField';
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative isolate max-w-7xl mx-auto px-6 py-24"
    >
      {/* Ambient 3D backdrop — scroll-reactive, blended behind the content rather
          than boxed as a separate widget. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-[30rem] opacity-80 sm:h-[34rem] [mask-image:linear-gradient(to_bottom,black,black_50%,transparent)]"
        aria-hidden="true"
      >
        <SceneCanvas
          className="h-full w-full"
          cameraPosition={[0, 1.6, 5.6]}
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--bg-gradient-purple)_0%,transparent_65%)]">
              <p className="text-xs uppercase tracking-widest text-muted">
                {skills.length} skills across {Object.keys(grouped).length} disciplines
              </p>
            </div>
          }
        >
          <OrbitField count={skills.length} scrollProgress={scrollYProgress} />
        </SceneCanvas>
      </div>

      <SectionConnector />

      <AnimatedSection>
        <SectionHeader
          label="Expertise"
          title="Skills & Proficiency"
          subtitle="Technologies and tools I work with every day."
        />
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {Object.entries(grouped).map(([category, categorySkills], i) => (
          <AnimatedSection key={category} delay={i * 0.1}>
            <Tilt3D maxTilt={5} className="rounded-2xl h-full">
            <div className="glass rounded-2xl p-6 hover:border-accent transition-all h-full">
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
            </Tilt3D>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}


