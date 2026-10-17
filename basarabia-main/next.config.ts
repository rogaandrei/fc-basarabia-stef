import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // site static → îl poți pune pe orice hosting (Vercel, Netlify, Cloudflare Pages, cPanel)
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' }
};

export default nextConfig;
