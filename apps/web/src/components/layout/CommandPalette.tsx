'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResults {
  projects: { title: string; slug: string }[];
  services: { title: string; slug: string }[];
  blogPosts: { title: string; slug: string }[];
}

const EMPTY: SearchResults = { projects: [], services: [], blogPosts: [] };
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Site search, wired to the API's `/search` endpoint.
 *
 * That endpoint was fully implemented on the backend and connected to nothing:
 * the frontend even shipped a `searchContent` helper that no file imported.
 *
 * It is a palette rather than a search page because the audience is technical
 * and ⌘K is faster — but it is opened by a visible toolbar button too, so it
 * is never a keyboard-only affordance.
 */
export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<Element | null>(null);
  const router = useRouter();
  const listId = useId();

  const flat = [
    ...results.projects.map((r) => ({ ...r, kind: 'Project', href: `/projects/${r.slug}` })),
    ...results.services.map((r) => ({ ...r, kind: 'Service', href: `/services/${r.slug}` })),
    ...results.blogPosts.map((r) => ({ ...r, kind: 'Writing', href: `/blog/${r.slug}` })),
  ];

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;
    inputRef.current?.focus();
    // Stop the page scrolling behind the dialog.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      (restoreRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults(EMPTY);
      setCursor(0);
    }
  }, [open]);

  /* Debounced query. The API's default throttle is 60 requests/minute, so a
     keystroke-per-request type-ahead would rate-limit a fast typist. */
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || !API_URL) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`${API_URL}/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : EMPTY))
        .then((data: SearchResults) => {
          setResults({
            projects: data.projects ?? [],
            services: data.services ?? [],
            blogPosts: data.blogPosts ?? [],
          });
          setCursor(0);
        })
        .catch(() => {
          /* Aborted or offline — keep the previous results rather than flashing empty. */
        })
        .finally(() => setLoading(false));
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!open) return null;

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(0, flat.length - 1)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === 'Enter' && flat[cursor]) {
      event.preventDefault();
      go(flat[cursor].href);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-canvas/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-lg border border-rule-strong bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search size={16} aria-hidden="true" className="shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, services, writing…"
            aria-label="Search projects, services and writing"
            aria-controls={listId}
            aria-expanded={flat.length > 0}
            className="min-h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        <div id={listId} role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto">
          {query.trim().length < 2 ? (
            <p className="px-4 py-6 text-sm text-ink-dim">
              Type at least two characters to search.
            </p>
          ) : loading && flat.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-dim">Searching…</p>
          ) : flat.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-dim">
              Nothing matches “{query.trim()}”. Search covers titles only.
            </p>
          ) : (
            <ul className="py-1">
              {flat.map((item, index) => (
                <li key={`${item.kind}-${item.slug}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === cursor}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setCursor(index)}
                    className={cn(
                      'flex w-full items-baseline gap-3 px-4 py-2.5 text-left text-sm',
                      index === cursor ? 'bg-raised text-ink' : 'text-ink-dim',
                    )}
                  >
                    <span className="meta w-14 shrink-0">{item.kind}</span>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="border-t border-rule px-4 py-2 font-mono text-2xs text-ink-faint">
          ↑↓ navigate · ↵ open · esc close
        </p>
      </div>
    </div>
  );
}
