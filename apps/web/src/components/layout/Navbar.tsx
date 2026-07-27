'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#services', label: 'Services', id: 'services' },
  { href: '/#projects', label: 'Projects', id: 'projects' },
  { href: '/#skills', label: 'Skills', id: 'skills' },
  { href: '/blog', label: 'Blog', id: null },
  { href: '/#contact', label: 'Contact', id: 'contact' },
];

interface NavbarProps {
  ownerName?: string;
}

export default function Navbar({ ownerName = 'Amal Anilkumar' }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const sectionIds = navLinks.map((l) => l.id).filter((id): id is string => Boolean(id));
  const activeId = useActiveSection(pathname === '/' ? sectionIds : []);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-[999] transition-all duration-300',
        scrolled
          ? 'border-b border-default bg-background/80 backdrop-blur-md'
          : 'bg-background/80 backdrop-blur-md',
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm sm:text-base gradient-text">{ownerName}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm text-secondary transition-colors hover:text-primary dark:hover:text-primary',
                link.id && activeId === link.id && 'text-primary',
              )}
            >
              {link.label}
              {link.id && activeId === link.id && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full gradient-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-lg glass hover:bg-white/10 transition-colors text-secondary hover:text-primary"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <Link
            href="/#contact"
            className="gradient-bg px-4 py-2 rounded-xl text-sm text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-secondary"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 text-secondary hover:text-primary transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-default px-6 pb-4 pt-2 bg-background z-[998] backdrop-blur-md"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-secondary hover:text-primary border-b border-default last:border-0 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="block mt-4 gradient-bg text-center px-4 py-2.5 rounded-xl text-sm text-white font-semibold"
            >
              Hire Me
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

