'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type MotionMode = 'auto' | 'reduced';

const STORAGE_KEY = 'motion-preference';

interface MotionPreferenceContextValue {
  /** True when motion should be suppressed, from either the OS or the toggle. */
  reduceMotion: boolean;
  /** OS-level `prefers-reduced-motion` state. */
  prefersReducedMotion: boolean;
  /** Explicit user override, persisted in localStorage. */
  userPreference: MotionMode;
  setUserPreference: (mode: MotionMode) => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(null);

/* ── localStorage as an external store ───────────────────────────────────────
   Reading persisted state through `useSyncExternalStore` keeps the server
   snapshot ("auto") and the client snapshot distinct without the extra render
   pass that a useState + useEffect pair costs on every mount.
   ───────────────────────────────────────────────────────────────────────── */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep the preference consistent across tabs.
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getSnapshot(): MotionMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'reduced' ? 'reduced' : 'auto';
  } catch {
    // Private mode or blocked site data — the default still applies.
    return 'auto';
  }
}

function getServerSnapshot(): MotionMode {
  return 'auto';
}

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const userPreference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const reduceMotion = userPreference === 'reduced' || prefersReducedMotion;

  /*
   * Mirror the resolved preference onto <html> as a data attribute.
   *
   * This is what makes the toggle actually work. Previously the preference
   * lived only in React context, so it governed the six components that
   * remembered to call the hook and nothing else — every CSS keyframe
   * animation and every Framer loop that skipped the check ran regardless.
   * One attribute lets a single rule in globals.css gate the whole document.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (reduceMotion) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');
  }, [reduceMotion]);

  const setUserPreference = useCallback((mode: MotionMode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Not persistable, but the in-memory value below still applies.
    }
    emit();
  }, []);

  const value = useMemo(
    () => ({ reduceMotion, prefersReducedMotion, userPreference, setUserPreference }),
    [reduceMotion, prefersReducedMotion, userPreference, setUserPreference],
  );

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
