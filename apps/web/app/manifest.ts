import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amal Anilkumar | Full-Stack and AI Engineer',
    short_name: 'Amal',
    description:
      'Portfolio of Amal Anilkumar, a full-stack software engineer building scalable web products and AI-powered systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#101418',
    theme_color: '#101418',
    orientation: 'portrait',
    categories: ['portfolio', 'productivity', 'business'],
    // The manifest previously declared no icons at all, and there was no
    // favicon anywhere in the app — installing the PWA produced a blank tile.
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
