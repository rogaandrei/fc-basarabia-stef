import type { Metadata } from 'next';
import { t, LANG_PATH, OG_LOCALE, type Lang } from './dict';

/** Titlu, descriere și legăturile între versiunile de limbă (pentru Google) */
export function metaFor(lang: Lang): Metadata {
  const d = t(lang);
  return {
    title: { absolute: d.meta.title },
    description: d.meta.description,
    alternates: {
      canonical: LANG_PATH[lang],
      languages: { ro: LANG_PATH.ro, en: LANG_PATH.en, 'x-default': LANG_PATH.ro }
    },
    openGraph: { type: 'website', locale: OG_LOCALE[lang], url: LANG_PATH[lang], siteName: 'FC Basarabia', title: d.meta.title, description: d.meta.description },
    twitter: { card: 'summary_large_image', title: d.meta.title, description: d.meta.description }
  };
}
