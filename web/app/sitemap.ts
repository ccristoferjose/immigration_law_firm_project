import type { MetadataRoute } from 'next';
import { defaultLocale, locales } from '@/lib/i18n';
import { noindexPages, pages, serviceIds, servicePath, type PageKey } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';

/** Public, indexable pages in both languages, each with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pairs = [
    ...(Object.keys(pages) as PageKey[]).filter((k) => !noindexPages.includes(k)).map((k) => pages[k]),
    ...serviceIds.map((id) => ({ en: servicePath(id, 'en'), es: servicePath(id, 'es') })),
  ];
  const lastModified = new Date();

  return pairs.flatMap((pair) =>
    locales.map((locale) => ({
      url: absoluteUrl(pair[locale]),
      lastModified,
      alternates: {
        languages: { es: absoluteUrl(pair.es), en: absoluteUrl(pair.en), 'x-default': absoluteUrl(pair[defaultLocale]) },
      },
    }))
  );
}
