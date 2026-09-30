/**
 * Content Security Policy, delivered as a <meta http-equiv> tag because the site is a
 * static export (GitHub Pages cannot send custom headers). Allows only this site's own
 * resources, Google Analytics (loaded only when NEXT_PUBLIC_GA_ID is set) and the
 * Google Maps embed. `frame-ancestors` is not supported in a meta tag, so it is omitted.
 * If you add a third-party script, iframe or API, add its origin here.
 */
const isDev = process.env.NODE_ENV === 'development';

export const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is required by Next.js without nonces (see the Next.js CSP guide).
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');
