import SiteChrome from '@/components/layout/SiteChrome';
import Footer from '@/components/layout/Footer';
import AnalyticsDelegate from '@/components/analytics/AnalyticsDelegate';
import { fetchProfile } from '@/lib/api';

/**
 * The single owner of the public site's chrome.
 *
 * The homepage previously sat outside this route group and hand-duplicated the
 * navbar, footer, ambient background and JSON-LD, which meant two copies of the
 * shell had to be kept in sync. It now lives inside the group.
 *
 * Site-wide JSON-LD is deliberately *not* emitted here: the homepage builds a
 * richer Person graph from collections this layout does not fetch, and two
 * Person nodes on one page is worse than one good one. Inner pages emit their
 * own.
 */
export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  const profile = await fetchProfile();

  return (
    <>
      <SiteChrome />
      <AnalyticsDelegate />
      {/* The skip link in Navbar targets this. */}
      <main id="main">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
