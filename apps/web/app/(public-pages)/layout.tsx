import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProfile } from '@/lib/api';
import { JsonLd, buildPersonSchema, buildWebSiteSchema } from '@/lib/jsonld';

export default async function PublicPagesLayout({ children }: { children: React.ReactNode }) {
  const profile = await fetchProfile();
  const ownerName = 'Amal A';

  return (
    <>
      {profile && (
        <JsonLd data={[buildWebSiteSchema(), buildPersonSchema({ name: profile.name, bio: profile.bio, email: profile.email, avatarUrl: profile.avatarUrl, sameAs: ['https://github.com/Amalanilkumar282', 'https://www.linkedin.com/in/amal-a-99360b31b/'] })]} />
      )}
      <Navbar ownerName={profile?.name ?? ownerName} />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  );
}
