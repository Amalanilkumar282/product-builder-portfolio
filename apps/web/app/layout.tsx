import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/layout/ThemeProvider';

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
const ownerName = 'Amal A';
const ownerTitle = 'Full-Stack & Mobile Engineer';

export const metadata: Metadata = {
  title: {
    default: `${ownerName} — Product Builder & Full-Stack Engineer`,
    template: `%s | ${ownerName}`,
  },
  description:
    'Full-stack and mobile engineer who builds complete, production-ready products — from web apps and mobile to enterprise tools and AI integrations.',
  keywords: [
    'product builder',
    'full stack developer',
    'mobile app developer',
    'react native developer',
    'Next.js developer',
    'NestJS developer',
    'software engineer Kerala',
    'hire developer India',
    'TypeScript developer',
    'freelance developer',
  ],
  authors: [{ name: ownerName }],
  creator: ownerName,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${ownerName} — Product Builder & Full-Stack Engineer`,
    description:
      'Full-stack and mobile engineer who builds complete, production-ready products — web apps, mobile, enterprise tools, and AI integrations.',
    siteName: ownerName,
    images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(ownerName + ' — Product Builder')}&subtitle=${encodeURIComponent(ownerTitle)}&type=page`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} — Product Builder & Full-Stack Engineer`,
    description:
      'Full-stack and mobile engineer who builds complete, production-ready products.',
    images: [`${siteUrl}/og?title=${encodeURIComponent(ownerName + ' — Product Builder')}&type=page`],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

