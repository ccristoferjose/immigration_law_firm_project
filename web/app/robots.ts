import type { MetadataRoute } from 'next';
import { pages } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';

// Generated once at build time (static export).
export const dynamic = 'force-static';

/**
 * Public pages are crawlable. Private/utility routes are disallowed (they are also
 * `noindex` or do not exist yet). Never add `Disallow: /` here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/internal/', '/preview/', pages.thankYou.en, pages.thankYou.es],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
