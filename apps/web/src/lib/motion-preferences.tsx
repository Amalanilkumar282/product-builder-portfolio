'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsLowPowerDevice, useWebglSupport } from '@/hooks/useWebglSupport';

export type MotionMode = 'auto' | 'reduced';

const STORAGE_KEY = 'motion-preference';

interface MotionPreferenceContextValue {
  /** True when flagship WebGL scenes should render (device + preference aware). */
  allow3D: boolean;
  /** True when lightweight CSS motion (tilt, parallax) should be disabled. */
  reduceMotion: boolean;
  /** OS-level `prefers-reduced-motion` state. */
  prefersReducedMotion: boolean;
  /** Explicit user override, persisted in localStorage. */
  userPreference: MotionMode;
  setUserPreference: (mode: MotionMode) => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const webglSupported = useWebglSupport();
  const isLowPowerDevice = useIsLowPowerDevice();
  const [userPreference, setUserPreferenceState] = useState<MotionMode>('auto');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'auto' || stored === 'reduced') {
      setUserPreferenceState(stored);
    }
    setHydrated(true);
  }, []);

  const setUserPreference = (mode: MotionMode) => {
    setUserPreferenceState(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  };

  const allow3D = useMemo(() => {
    if (!hydrated) return false;
    if (userPreference === 'reduced') return false;
    return webglSupported && !prefersReducedMotion && !isLowPowerDevice;
  }, [hydrated, userPreference, webglSupported, prefersReducedMotion, isLowPowerDevice]);

  const reduceMotion = userPreference === 'reduced' || prefersReducedMotion;

  const value: MotionPreferenceContextValue = {
    allow3D,
    reduceMotion,
    prefersReducedMotion,
    userPreference,
    setUserPreference,
  };

  return (
    <MotionPreferenceContext.Provider value={value}>{children}</MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference(): MotionPreferenceContextValue {
  const ctx = useContext(MotionPreferenceContext);
  if (!ctx) {
    throw new Error('useMotionPreference must be used within a MotionPreferenceProvider');
  }
  return ctx;
}
