import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ThemeProvider from '@/components/layout/ThemeProvider';
import { MotionPreferenceProvider } from '@/lib/motion-preferences';
import { CANONICAL_NAME, DEFAULT_BIO, DEFAULT_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

/*
 * Two families, each with a job. Archivo is an industrial grotesque that holds
 * up at display sizes and still reads as a text face at 16px; JetBrains Mono
 * carries every *value* on the site — dates, counts, tags, category labels —
 * which is the rule that makes the page read as a record rather than a
 * brochure.
 *
 * This replaces three families, one of which (Plus Jakarta Sans) was preloaded
 * on every page and applied to zero elements, and another (Geist Mono) which
 * existed to style a single admin textarea. Net font payload goes down.
 */
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

const ownerName = CANONICAL_NAME;
const ownerTitle = DEFAULT_TITLE;

export const metadata: Metadata = {
  title: {
    default: `${ownerName} | Product Builder, Full-Stack and AI Engineer`,
    template: `%s | ${ownerName}`,
  },
  description: DEFAULT_BIO,
  keywords: [
    'Amal Anilkumar',
    'Amal A',
    'product builder',
    'full stack developer',
    'AI developer',
    'Next.js developer',
    'NestJS developer',
    'software engineer Kerala',
    'TypeScript developer',
    'technical SEO engineer',
    'react native developer',
  ],
  authors: [{ name: ownerName }],
  creator: ownerName,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${ownerName} | Product Builder, Full-Stack and AI Engineer`,
    description: DEFAULT_BIO,
    siteName: 'amalanilkumar.com',
    images: [
      {
        url: `${SITE_URL}/og?title=${encodeURIComponent(ownerName)}&subtitle=${encodeURIComponent(ownerTitle)}&type=page`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} | Product Builder, Full-Stack and AI Engineer`,
    description: DEFAULT_BIO,
    images: [`${SITE_URL}/og?title=${encodeURIComponent(ownerName)}&type=page`],
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <GoogleAnalytics />
      </head>
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
