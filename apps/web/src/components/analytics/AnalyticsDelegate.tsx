'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * A single delegated click listener for the whole document.
 *
 * Conversion tracking used to live as 23 inline `onClick={() => trackEvent(…)}`
 * props spread across the hero, contact section and footer — which forced all
 * three to be client components purely for analytics, and meant any rewrite of
 * those files silently zeroed out resume downloads, WhatsApp taps and form
 * submissions with no error to notice.
 *
 * Declaring the event on the element as `data-analytics` instead keeps the
 * markup on the server and makes the instrumentation greppable.
 */
export default function AnalyticsDelegate() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[data-analytics]');
      if (!el) return;

      const name = el.dataset.analytics;
      if (!name) return;

      const location = el.dataset.analyticsLocation;
      trackEvent(name, location ? { location } : undefined);
    }

    // Capture phase so the event is recorded even when a handler further down
    // calls stopPropagation, and passive since nothing here is cancelled.
    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
