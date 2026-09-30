import type { Metadata } from 'next';
import { defaultLocale, localeMeta, otherLocale, type Locale } from './i18n';
import { site, siteUrl } from './site';

type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Localized paths for this page, e.g. { en: '/en/about', es: '/sobre-nosotros' }. */
  paths: Record<Locale, string>;
  noindex?: boolean;
  /** Set for the home page so the title isn't suffixed with the firm name twice. */
  absoluteTitle?: boolean;
};

/**
 * Builds unique per-page metadata: title, description, self-referencing canonical,
 * hreflang alternates (es, en, x-default → Spanish), Open Graph and Twitter cards.
 * Relative URLs are resolved against `metadataBase` (the production domain).
 */
export function pageMetadata({ locale, title, description, paths, noindex, absoluteTitle }: PageMetaInput): Metadata {
  const url = paths[locale];
  const fullTitle = absoluteTitle ? `${title} | ${site.name}` : title;

  return {
    title: absoluteTitle ? { absolute: fullTitle } : title,
    description,
    alternates: noindex
      ? undefined
      : {
          canonical: url,
          languages: { es: paths.es, en: paths.en, 'x-default': paths[defaultLocale] },
        },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: absoluteTitle ? fullTitle : `${title} | ${site.name}`,
      description,
      url,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: localeMeta[otherLocale(locale)].ogLocale,
      images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: absoluteTitle ? fullTitle : `${title} | ${site.name}`,
      description,
      images: ['/images/og-default.jpg'],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

/** Metadata shared by every page in a locale's root layout. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: { template: `%s | ${site.name}`, default: site.name },
    description: site.tagline[locale],
    applicationName: site.name,
    formatDetection: { telephone: false },
  };
}

export function absoluteUrl(path: string): string {
  return path === '/' ? siteUrl : `${siteUrl}${path}`;
}
