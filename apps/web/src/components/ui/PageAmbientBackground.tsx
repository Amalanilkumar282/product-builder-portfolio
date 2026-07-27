'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useMotionPreference } from '@/lib/motion-preferences';

/**
 * Full-viewport, fixed ambient backdrop rendered once behind every public
 * page (Home + `(public-pages)` group only — never the admin panel). It
 * echoes the same purple/blue radial-gradient anchors already baked into the
 * static `body` background (globals.css) but brings them to life with a
 * slow scroll-linked drift plus a gentle autonomous "breathing" pulse, so
 * scrolling the page feels like moving through a living depth field instead
 * of past a flat static graphic.
 *
 * Purely decorative: `aria-hidden`, `pointer-events-none`, negative z-index.
 * The scroll-linked drift is skipped (blobs sit still, only breathing)
 * when the user prefers reduced motion or has disabled 3D/motion — the
 * same `reduceMotion` gate used by Tilt3D/DepthParallax.
 */
export default function PageAmbientBackground() {
  const { reduceMotion } = useMotionPreference();
  const { scrollYProgress } = useScroll();

  const purpleY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const purpleX = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const blueY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const blueX = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={reduceMotion ? undefined : { x: purpleX, y: purpleY }}
        className="absolute left-[5%] top-[6%] h-[42rem] w-[42rem]"
      >
        <div
          className="ambient-pulse h-full w-full rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)' }}
        />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { x: blueX, y: blueY }}
        className="absolute -right-[10%] top-[55%] h-[46rem] w-[46rem]"
      >
        <div
          className="ambient-pulse h-full w-full rounded-full blur-[120px] [animation-delay:-8s]"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)' }}
        />
      </motion.div>
    </div>
  );
}
