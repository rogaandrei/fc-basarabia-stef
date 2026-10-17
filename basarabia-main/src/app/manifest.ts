import type { MetadataRoute } from 'next';
import { club } from '@/data/club';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: club.name,
    short_name: club.shortName,
    description: club.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#061630',
    theme_color: '#0a2042',
    lang: 'ro',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
