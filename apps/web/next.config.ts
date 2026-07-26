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
  // NOTE: canonical domain (www vs non-www) redirect is handled entirely by
  // Vercel's Domains settings (Project > Settings > Domains > Primary Domain).
  // Do NOT also redirect here — having both Vercel and this config redirect
  // in opposite directions causes an infinite redirect loop (ERR_TOO_MANY_REDIRECTS).
};

export default nextConfig;

