import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, then WebP. The default is WebP only, so AVIF-capable
    // browsers were being served a larger format than they could handle.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Tech-stack and skill icons are frequently SVG, and the upload endpoint
    // accepts them — but with `dangerouslyAllowSVG` off they failed to render
    // through the optimizer entirely. The CSP below neutralises the risk that
    // flag normally carries: no scripts, no plugins, and rendered detached
    // from the page's origin.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    // Both are barrel-heavy; lucide-react alone is imported at 36 sites.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async redirects() {
    // Enforce a single canonical domain (non-www) so Google never splits
    // ranking signals between amalanilkumar.com and www.amalanilkumar.com.
    // This is a code-level backup; the primary domain should also be set
    // in the hosting provider's  dashboard.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.amalanilkumar.com" }],
        destination: "https://amalanilkumar.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Fingerprinted build assets are immutable, so they should never be
        // revalidated. Nothing set cache headers before.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
