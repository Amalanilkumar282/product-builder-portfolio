import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amal Anilkumar — Software Engineer',
    short_name: 'Amal.dev',
    description:
      'Portfolio of Amal Anilkumar — full-stack software engineer building scalable web products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#a855f7',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['portfolio', 'productivity', 'business'],
  };
}
