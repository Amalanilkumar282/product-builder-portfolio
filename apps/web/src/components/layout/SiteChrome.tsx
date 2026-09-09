'use client';

import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import CommandPalette from './CommandPalette';

/**
 * Holds the one piece of state the header and the palette share.
 *
 * Keeping it here means the rest of the page chrome — footer, sections, page
 * bodies — stays on the server. The previous layout duplicated the whole
 * chrome in two places (the homepage sat outside the route group and
 * hand-rolled its own copy), so any change had to be made twice.
 */
export default function SiteChrome() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
