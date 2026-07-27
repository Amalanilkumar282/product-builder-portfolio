'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/lib/motion-preferences';
import { cn } from '@/lib/utils';

interface DepthParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Max vertical drift in pixels applied across the element's scroll range. */
  depth?: number;
  /** Reverses drift direction — useful to alternate depth between layers. */
  reverse?: boolean;
}

/**
 * Cheap, CSS-only (no WebGL) scroll-linked depth effect. Wraps children in a
 * translateY tied to the element's scroll progress through the viewport,
 * giving a layered-depth feel to timelines, headers, and hero content.
 * Disabled entirely when the user prefers reduced motion.
 */
export default function DepthParallax({
  children,
  className,
  depth = 40,
  reverse = false,
}: DepthParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const range = reverse ? [depth, -depth] : [-depth, depth];
  const y = useTransform(scrollYProgress, [0, 1], range);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}
