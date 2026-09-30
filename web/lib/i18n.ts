/** Spanish is the primary language (served at `/`); English lives under `/en`. */
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/** Values for <html lang>, hreflang and Open Graph. */
export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string }> = {
  en: { htmlLang: 'en', ogLocale: 'en_US', label: 'English' },
  es: { htmlLang: 'es', ogLocale: 'es_US', label: 'Español' },
};

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/** Small helper for inline bilingual strings: t(locale, { en: '...', es: '...' }). */
export function t<T>(locale: Locale, value: Record<Locale, T>): T {
  return value[locale];
}
