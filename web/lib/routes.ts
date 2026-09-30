import type { Locale } from './i18n';

/**
 * Single source of truth for every public URL in both languages.
 * Used by navigation, the language switcher, canonical/hreflang metadata and the sitemap.
 * This file is imported by client components, so keep it free of heavy content.
 */
export const pages = {
  home: { en: '/en', es: '/' },
  about: { en: '/en/about', es: '/sobre-nosotros' },
  services: { en: '/en/immigration-services', es: '/servicios-de-inmigracion' },
  resources: { en: '/en/resources', es: '/recursos' },
  faq: { en: '/en/faq', es: '/preguntas-frecuentes' },
  contact: { en: '/en/contact', es: '/contacto' },
  thankYou: { en: '/en/thank-you', es: '/gracias' },
  privacy: { en: '/en/privacy-policy', es: '/politica-de-privacidad' },
  terms: { en: '/en/terms-of-use', es: '/terminos-de-uso' },
  disclaimer: { en: '/en/legal-disclaimer', es: '/aviso-legal' },
  accessibility: { en: '/en/accessibility', es: '/accesibilidad' },
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
