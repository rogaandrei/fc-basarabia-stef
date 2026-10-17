import type { Metadata, Viewport } from 'next';
import './globals.css';
import { club, SITE_URL } from '@/data/club';

const title = `${club.name} — Minifotbal Timișoara | ${club.league}`;
const description =
  'FC Basarabia — echipa de minifotbal a basarabenilor din Timișoara, fondată în 2023. Program, rezultate și clasament Liga III-B Alborz Timiș, lotul echipei și cum poți susține clubul (Formular 230 – 3,5%).';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${club.name}` },
  description,
  applicationName: club.name,
  keywords: [
    'FC Basarabia',
    'Basarabia fotbal',
    'echipă fotbal',
    'Liga III-B',
    'minifotbal Timișoara',
    'Alborz minifotbal',
    'campionat minifotbal Timiș',
    'fotbal amator Timișoara',
    'basarabeni în România',
    'moldoveni în România',
    'Asociația Fotbal Club Basarabia',
    'formular 230 fotbal'
  ],
  authors: [{ name: club.legalName }],
  creator: club.legalName,
  publisher: club.legalName,
  category: 'sports',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: '/',
    siteName: club.name,
    title,
    description
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  formatDetection: { telephone: false, address: false, email: false }
};

export const viewport: Viewport = {
  themeColor: '#0a2042',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" dir="ltr">
      <head>
        <link rel="preload" href="/fonts/bebas-neue-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Sari la conținut
        </a>
        {children}
      </body>
    </html>
  );
}
