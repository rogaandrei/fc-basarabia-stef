import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/club';

export const dynamic = 'force-static';

const languages = { ro: `${SITE_URL}/`, en: `${SITE_URL}/en/` };

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(languages).map((url, i) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: i === 0 ? 1 : 0.8,
    alternates: { languages }
  }));
}
