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
    categories: ['portfolio', 'productivity', 'business'],
  };
}
