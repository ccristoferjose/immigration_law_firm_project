import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages (`npm run build` writes the site to `out/`).
 *
 * NEXT_PUBLIC_BASE_PATH is the sub-path the site is served from, e.g.
 * '/immigration_law_firm_project' for https://<user>.github.io/immigration_law_firm_project/.
 * Leave it empty when the site is served from a domain root (custom domain or local preview).
 *
 * A static host cannot send custom headers or redirects, so the Content Security Policy
 * is set with a <meta> tag instead (see lib/csp.ts) and GitHub Pages enforces HTTPS.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  // Emit /page/index.html so every URL works on a plain static file host.
  trailingSlash: true,
  experimental: {
    // Needed for a single 404 page across the two root layouts (Spanish and English).
    globalNotFound: true,
  },
  images: {
    // The default image optimizer needs a server; images are served as-is.
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
