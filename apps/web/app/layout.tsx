import type { Metadata } from 'next';
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ThemeProvider from '@/components/layout/ThemeProvider';
import { MotionPreferenceProvider } from '@/lib/motion-preferences';
import { CANONICAL_NAME, DEFAULT_BIO, DEFAULT_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Scroll-reveal animations are server-rendered by Framer Motion with an
          inline `opacity:0`, and only become visible once the client bundle has
          hydrated. Crawlers that do not execute JavaScript — GPTBot, ClaudeBot,
          PerplexityBot and CCBot among them, all of which robots.txt explicitly
          welcomes — would otherwise parse a page whose body content is entirely
          transparent. This reveals that content when scripting is unavailable;
          when JS runs, the animations play exactly as before.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <GoogleAnalytics />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
