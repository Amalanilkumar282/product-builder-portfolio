'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/lib/motion-preferences';
import { cn } from '@/lib/utils';

interface TimelineSpineProps {
  className?: string;
}

/**
 * Vertical timeline spine that fills with a glowing gradient as the user
 * scrolls through it — a "circuit trace" visualization of career progress.
 * Pure CSS/transform (no WebGL). Falls back to a static track when the user
 * prefers reduced motion.
 */
export default function TimelineSpine({ className }: TimelineSpineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={cn('bg-slate-800/60', className)}>
      {!reduceMotion && (
        <motion.div
          style={{ scaleY, transformOrigin: 'top' }}
          className="h-full w-full gradient-bg glow-purple"
        />
      )}
    </div>
  );
}
