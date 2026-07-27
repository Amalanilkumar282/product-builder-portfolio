'use client';

import { useEffect, useState } from 'react';

let cachedSupport: boolean | null = null;

function detectWebglSupport(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    cachedSupport = Boolean(gl);
  } catch {
    cachedSupport = false;
  }

  return cachedSupport;
}

/**
 * Detects whether the browser can render WebGL content at all.
 * Result is memoized process-wide since it never changes at runtime.
 */
export function useWebglSupport(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(detectWebglSupport());
  }, []);

  return supported;
}

/**
 * Rough heuristic for "is this a low-power device" — used to keep the
 * flagship WebGL scenes exclusive to devices that can comfortably run them.
 * Errs on the side of enabling 3D; only disables for clearly constrained
 * devices (low core count / low memory / narrow viewport = likely mobile).
 */
export function useIsLowPowerDevice(): boolean {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isNarrowViewport = window.innerWidth < 768;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    const constrained = cores <= 4 || memory <= 4;
    setLowPower(constrained && (isNarrowViewport || isCoarsePointer));
  }, []);

  return lowPower;
}
