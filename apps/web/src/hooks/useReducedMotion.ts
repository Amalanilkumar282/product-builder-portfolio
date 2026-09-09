'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** The server cannot know the preference, so it renders the motion-on branch. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks the user's OS-level `prefers-reduced-motion` preference.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: reading a media
 * query is exactly the external-store case this hook exists for, and it avoids
 * the extra render pass (and the setState-in-effect lint error) that the
 * previous implementation incurred on every mount.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
