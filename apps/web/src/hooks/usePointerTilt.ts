'use client';

import { useRef } from 'react';
import { useMotionValue, useSpring, type SpringOptions } from 'framer-motion';

interface UsePointerTiltOptions {
  /** Maximum rotation in degrees applied on each axis. */
  maxTilt?: number;
  /** Spring physics for the tilt return-to-rest motion. */
  spring?: SpringOptions;
  /** When false, tilt is inert (used for reduced-motion / low-power fallback). */
  enabled?: boolean;
}

const DEFAULT_SPRING: SpringOptions = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Shared pointer-relative tilt physics used by Tilt3D and any custom 3D-ish
 * hover interactions. Returns motion values for rotateX/rotateY plus a glare
 * position (0-100%) and the pointer handlers to spread onto the target element.
 */
export function usePointerTilt({
  maxTilt = 8,
  spring = DEFAULT_SPRING,
  enabled = true,
}: UsePointerTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const glareXRaw = useMotionValue(50);
  const glareYRaw = useMotionValue(50);

  const rotateX = useSpring(rotateXRaw, spring);
  const rotateY = useSpring(rotateYRaw, spring);
  const glareX = useSpring(glareXRaw, spring);
  const glareY = useSpring(glareYRaw, spring);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rotateYRaw.set((px - 0.5) * maxTilt * 2);
    rotateXRaw.set((0.5 - py) * maxTilt * 2);
    glareXRaw.set(px * 100);
    glareYRaw.set(py * 100);
  };

  const onPointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    glareXRaw.set(50);
    glareYRaw.set(50);
  };

  return { ref, rotateX, rotateY, glareX, glareY, onPointerMove, onPointerLeave };
}
