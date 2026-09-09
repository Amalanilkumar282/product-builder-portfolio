'use client';

import { useMotionPreference } from '@/lib/motion-preferences';

export default function MotionPreferenceToggle() {
  const { userPreference, setUserPreference, prefersReducedMotion } = useMotionPreference();
  const reduced = userPreference === 'reduced';

  return (
    <button
      type="button"
      onClick={() => setUserPreference(reduced ? 'auto' : 'reduced')}
      aria-pressed={reduced}
      className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-mono text-2xs text-ink-faint transition-colors hover:text-ink-dim"
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${reduced ? 'bg-ink-faint' : 'bg-verdigris'}`}
      />
      {reduced ? 'Motion off' : 'Motion on'}
      {prefersReducedMotion && !reduced && (
        <span className="text-ink-faint">(system: reduced)</span>
      )}
    </button>
  );
}
