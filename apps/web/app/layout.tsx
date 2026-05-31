import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/layout/ThemeProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProfile } from '@/lib/api';
import { JsonLd, buildPersonSchema, buildWebSiteSchema } from '@/lib/jsonld';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
const ownerName = 'Amal Anilkumar';

export const metadata: Metadata = {
  title: {
    default: `${ownerName} — Software Engineer`,
    template: `%s | ${ownerName}`,
  },
  description:
    'Passionate full-stack software engineer building scalable web products and systems.',
  keywords: [
    'software engineer',
    'full stack developer',
    'product builder',
    'Next.js',
    'NestJS',
    'TypeScript',
    'portfolio',
  ],
  authors: [{ name: ownerName }],
  creator: ownerName,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${ownerName} — Software Engineer`,
    description:
      'Passionate full-stack software engineer building scalable web products and systems.',
    siteName: ownerName,
    images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(ownerName + ' — Software Engineer')}&subtitle=${encodeURIComponent('Full-stack engineer passionate about scalable web products')}&type=page`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} — Software Engineer`,
    description:
      'Passionate full-stack software engineer building scalable web products and systems.',
    images: [`${siteUrl}/og?title=${encodeURIComponent(ownerName + ' — Software Engineer')}&type=page`],
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${siteUrl}/feed.xml` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await fetchProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={[buildWebSiteSchema(), buildPersonSchema({ name: profile?.name, bio: profile?.bio, email: profile?.email, avatarUrl: profile?.avatarUrl })]} />
        <ThemeProvider>
          <Navbar ownerName={profile?.name ?? ownerName} />
          <main>{children}</main>
          <Footer profile={profile} />
        </ThemeProvider>
      </body>
    </html>
  );
}

