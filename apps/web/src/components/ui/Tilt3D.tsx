'use client';

import { motion, useMotionTemplate } from 'framer-motion';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { useMotionPreference } from '@/lib/motion-preferences';
import { cn } from '@/lib/utils';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. Keep small for enterprise polish. */
  maxTilt?: number;
  /** Adds a cursor-following glass "sheen" highlight over the content. */
  glare?: boolean;
}

/**
 * Wraps content with a subtle, pointer-reactive 3D tilt + optional glare sheen.
 * Automatically becomes inert (renders children unchanged, no wrapper side
 * effects) when the user prefers reduced motion, is on a low-power device, or
 * has disabled motion via the site's toggle — purely a lost hover effect,
 * never a loss of content or functionality.
 */
export default function Tilt3D({ children, className, maxTilt = 7, glare = true }: Tilt3DProps) {
  const { reduceMotion } = useMotionPreference();
  const enabled = !reduceMotion;
  const { ref, rotateX, rotateY, glareX, glareY, onPointerMove, onPointerLeave } = usePointerTilt({
    maxTilt,
    enabled,
  });
  const glareBackground = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 65%)`;

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn('group relative preserve-3d will-change-transform', className)}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
