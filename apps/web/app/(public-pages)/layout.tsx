import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageAmbientBackground from '@/components/ui/PageAmbientBackground';
import { fetchProfile } from '@/lib/api';
import {
  JsonLd,
  buildOrganizationReference,
  buildPersonSchema,
  buildWebSiteSchema,
} from '@/lib/entity-jsonld';
import { CANONICAL_NAME } from '@/lib/site';

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  const profile = await fetchProfile();

  return (
    <>
      <PageAmbientBackground />
      <JsonLd
        data={[
          buildWebSiteSchema(),
          buildOrganizationReference(),
          buildPersonSchema({ profile }),
        ]}
      />
      <Navbar ownerName={profile?.name ?? CANONICAL_NAME} />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  );
}
