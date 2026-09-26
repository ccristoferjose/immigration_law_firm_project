import type { Locale } from './i18n';

/**
 * Single source of truth for every public URL in both languages.
 * Used by navigation, the language switcher, canonical/hreflang metadata and the sitemap.
 * This file is imported by client components, so keep it free of heavy content.
 */
export const pages = {
  home: { en: '/', es: '/es' },
  about: { en: '/about', es: '/es/sobre-nosotros' },
  services: { en: '/immigration-services', es: '/es/servicios-de-inmigracion' },
  resources: { en: '/resources', es: '/es/recursos' },
  faq: { en: '/faq', es: '/es/preguntas-frecuentes' },
  contact: { en: '/contact', es: '/es/contacto' },
  thankYou: { en: '/thank-you', es: '/es/gracias' },
  privacy: { en: '/privacy-policy', es: '/es/politica-de-privacidad' },
  terms: { en: '/terms-of-use', es: '/es/terminos-de-uso' },
  disclaimer: { en: '/legal-disclaimer', es: '/es/aviso-legal' },
  accessibility: { en: '/accessibility', es: '/es/accesibilidad' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pages;

/** Pages that must never be indexed or listed in the sitemap. */
export const noindexPages: PageKey[] = ['thankYou'];

/**
 * Services the firm offers, with localized URL slugs.
 * To remove a service, delete it here and in content/services.ts.
 */
export const serviceSlugs = {
  'family-immigration': { en: 'family-immigration', es: 'inmigracion-familiar' },
  'green-cards': { en: 'green-cards', es: 'residencia-permanente' },
  citizenship: { en: 'citizenship-naturalization', es: 'ciudadania-y-naturalizacion' },
  visas: { en: 'visas', es: 'visas' },
  'work-permits': { en: 'work-permits', es: 'permisos-de-trabajo' },
  'removal-defense': { en: 'removal-defense', es: 'defensa-contra-deportacion' },
  'humanitarian-relief': { en: 'humanitarian-relief', es: 'alivio-humanitario' },
  'document-review': { en: 'document-review', es: 'revision-de-documentos' },
} as const satisfies Record<string, Record<Locale, string>>;

export type ServiceId = keyof typeof serviceSlugs;
export const serviceIds = Object.keys(serviceSlugs) as ServiceId[];

export function pagePath(key: PageKey, locale: Locale): string {
  return pages[key][locale];
}

export function servicePath(id: ServiceId, locale: Locale): string {
  return `${pages.services[locale]}/${serviceSlugs[id][locale]}`;
}

export function serviceIdFromSlug(slug: string, locale: Locale): ServiceId | undefined {
  return serviceIds.find((id) => serviceSlugs[id][locale] === slug);
}

/** Every localized path pair, e.g. for the language switcher. */
export function allPathPairs(): Record<Locale, string>[] {
  return [
    ...Object.values(pages),
    ...serviceIds.map((id) => ({ en: servicePath(id, 'en'), es: servicePath(id, 'es') })),
  ];
}

/** Given the current path, return the equivalent path in the target locale. */
export function translatePath(pathname: string, target: Locale): string {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const pair = allPathPairs().find((p) => p.en === clean || p.es === clean);
  return pair ? pair[target] : pages.home[target];
}
