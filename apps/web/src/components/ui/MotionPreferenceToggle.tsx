'use client';

import { Zap, ZapOff } from 'lucide-react';
import { useMotionPreference } from '@/lib/motion-preferences';
import { cn } from '@/lib/utils';

interface MotionPreferenceToggleProps {
  className?: string;
}

/**
 * User-facing accessibility control letting visitors opt out of (or back
 * into) the site's 3D scenes and rich motion, independent of OS-level
 * `prefers-reduced-motion`. Persisted in localStorage via motion-preferences.
 */
export default function MotionPreferenceToggle({ className }: MotionPreferenceToggleProps) {
  const { userPreference, setUserPreference } = useMotionPreference();
  const isReduced = userPreference === 'reduced';

  return (
    <button
      type="button"
      onClick={() => setUserPreference(isReduced ? 'auto' : 'reduced')}
      aria-pressed={isReduced}
      title={isReduced ? 'Enable rich motion & 3D effects' : 'Reduce motion & 3D effects'}
      className={cn(
        'inline-flex items-center gap-2 glass rounded-xl px-3 py-2 text-xs font-medium text-secondary transition-all hover:border-accent hover:text-primary',
        className,
      )}
    >
      {isReduced ? <ZapOff size={14} /> : <Zap size={14} />}
      {isReduced ? 'Motion: Reduced' : 'Motion: Full'}
    </button>
  );
}
