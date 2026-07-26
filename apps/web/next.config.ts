import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
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
};

export default nextConfig;

