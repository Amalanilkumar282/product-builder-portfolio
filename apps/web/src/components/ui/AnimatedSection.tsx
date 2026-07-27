'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useMotionPreference } from '@/lib/motion-preferences';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const { reduceMotion } = useMotionPreference();

  const offsets = {
    up:    { y: 36, x: 0, rotateX: 9,   rotateY: 0 },
    down:  { y: -36, x: 0, rotateX: -9, rotateY: 0 },
    left:  { y: 0,  x: 36, rotateX: 0,  rotateY: -11 },
    right: { y: 0,  x: -36, rotateX: 0, rotateY: 11 },
    none:  { y: 0,  x: 0, rotateX: 6,   rotateY: 0 },
  } as const;

  const offset = offsets[direction];

  // Cinematic 3D tilt-in reveal by default; collapses to the original flat
  // fade/slide when the user prefers reduced motion — same trigger, same
  // timing, just without the perspective depth.
  const initial = reduceMotion
    ? { opacity: 0, y: offset.y, x: offset.x }
    : { opacity: 0, y: offset.y, x: offset.x, rotateX: offset.rotateX, rotateY: offset.rotateY };

  const animate = inView
    ? reduceMotion
      ? { opacity: 1, y: 0, x: 0 }
      : { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0 }
    : {};

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      style={reduceMotion ? undefined : { transformPerspective: 1000 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

