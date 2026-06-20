import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amal Anilkumar | Full-Stack and AI Engineer',
    short_name: 'Amal',
    description:
      'Portfolio of Amal Anilkumar, a full-stack software engineer building scalable web products and AI-powered systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#a855f7',
    orientation: 'portrait',
    categories: ['portfolio', 'productivity', 'business'],
  };
}
