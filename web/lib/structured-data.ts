import type { Locale } from './i18n';
import { pagePath } from './routes';
import { absoluteUrl } from './seo';
import { site } from './site';

/**
 * JSON-LD builders. Only factual details from lib/site.ts are published:
 * contact details only once `site.contact.verified` is true, the Attorney node only
 * once `site.attorney.name` is set. No ratings, reviews or awards are ever emitted.
 */

const orgId = `${absoluteUrl('/')}#organization`;

export function legalServiceJsonLd(locale: Locale) {
  const { contact, attorney } = site;
  const verified = contact.verified;

  const attorneyNode = attorney.name
    ? {
        '@type': 'Attorney',
        '@id': `${absoluteUrl('/')}#attorney`,
        name: attorney.name,
        worksFor: { '@id': orgId },
        knowsLanguage: site.languages,
        ...(attorney.barAdmissions.length ? { memberOf: attorney.barAdmissions.map((name) => ({ '@type': 'Organization', name })) } : {}),
      }
    : null;

  const legalService = {
    '@type': ['LegalService', 'Organization'],
    '@id': orgId,
    name: site.name,
    description: site.tagline[locale],
    url: absoluteUrl(pagePath('home', locale)),
    logo: absoluteUrl('/icon.svg'),
    image: absoluteUrl('/images/og-default.jpg'),
    knowsLanguage: site.languages,
    ...(verified
      ? {
          telephone: contact.phoneHref.replace('tel:', ''),
          email: contact.email,
          openingHours: site.hours.schema,
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.address.street,
            addressLocality: contact.address.city,
            addressRegion: contact.address.region,
            postalCode: contact.address.postalCode,
            addressCountry: contact.address.country,
          },
        }
      : {}),
    ...(attorneyNode ? { employee: { '@id': attorneyNode['@id'] } } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': attorneyNode ? [legalService, attorneyNode] : [legalService],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
