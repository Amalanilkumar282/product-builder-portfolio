'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CANONICAL_SHORT_NAME } from '@/lib/site';

const NAV_LINKS = [
  { href: '/projects', label: 'Work' },
  { href: '/experience', label: 'Record' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /*
   * Escape-to-close, focus restoration and a focus trap. The previous mobile
   * menu had none of these: focus stayed behind the open panel, Tab walked
   * into the page underneath, and there was no aria-expanded at all.
   */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      {/* Every page needs a way past the navigation. There was no skip link. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:border focus:border-verdigris focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-(--header-h) transition-colors duration-200',
          scrolled ? 'border-b border-rule bg-canvas/85 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-full items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="font-mono text-sm font-medium tracking-tight text-ink"
            aria-label={`${CANONICAL_SHORT_NAME} — home`}
          >
            {CANONICAL_SHORT_NAME}
            <span className="text-verdigris">.</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors',
                      active ? 'text-ink' : 'text-ink-dim hover:text-ink',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search the site"
                className="inline-flex size-11 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-raised hover:text-ink"
              >
                <Search size={16} aria-hidden="true" />
              </button>
            )}
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex size-11 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-raised hover:text-ink md:hidden"
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="fixed inset-x-0 top-(--header-h) z-40 border-b border-rule bg-canvas md:hidden"
        >
          <ul className="shell divide-y divide-rule py-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center text-base',
                      active ? 'text-verdigris' : 'text-ink',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      // Before mount the resolved theme is unknown, so the label would be a
      // guess; suppressing it until then avoids announcing the wrong action.
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle theme'}
      className="inline-flex size-11 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-raised hover:text-ink"
    >
      {mounted && isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}
