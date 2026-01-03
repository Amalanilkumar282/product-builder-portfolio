import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore - allow side-effect css import without type declarations
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Product Builder Portfolio",
    template: "%s | Product Builder Portfolio",
  },
  description: "Professional product builder portfolio showcasing innovative projects and services",
  keywords: ["product builder",
  "freelance product builder",
  "freelance developer",
  "full stack developer",
  "website development",
  "admin panel development",
  "portfolio",],
  authors: [{ name: "Product Builder" }],
  creator: "Product Builder",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Product Builder Portfolio",
    description: "Professional product builder portfolio showcasing innovative projects and services",
    siteName: "Product Builder Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Builder Portfolio",
    description: "Professional product builder portfolio showcasing innovative projects and services",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
