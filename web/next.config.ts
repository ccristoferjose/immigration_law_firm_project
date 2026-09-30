import type { NextConfig } from 'next';
import { allPathPairs } from './lib/routes';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content Security Policy: only this site's own resources, plus Google Analytics
 * (loaded only when NEXT_PUBLIC_GA_ID is set) and the Google Maps embed.
 * 'unsafe-inline' scripts are needed for Next.js without nonces (see the Next.js CSP guide).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const nextConfig: NextConfig = {
  experimental: {
    // Needed for a single 404 page across the two root layouts (English and Spanish).
    globalNotFound: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  /**
   * Spanish moved from /es/* to the root and English from the root to /en/*.
   * Keep old links and bookmarks working.
   */
  async redirects() {
    return allPathPairs().flatMap(({ en, es }) => {
      const oldEs = es === '/' ? '/es' : `/es${es}`;
      const oldEn = en === '/en' ? null : en.replace(/^\/en/, '');
      return [
        { source: oldEs, destination: es, permanent: true },
        ...(oldEn && oldEn !== es ? [{ source: oldEn, destination: en, permanent: true }] : []),
      ];
    });
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: csp },
          // HTTPS only for two years (browsers ignore this header over plain HTTP, e.g. localhost).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
