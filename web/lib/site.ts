/**
 * Firm facts shown across the site and in structured data (JSON-LD).
 *
 * ⚠️ Before launch, replace every placeholder below with the firm's real, verifiable
 * details. Do not add ratings, awards, years of experience or certifications that
 * cannot be verified.
 */

/**
 * Production origin used for canonical URLs, hreflang, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL in the production environment (e.g. https://www.yourfirm.com).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, '');

export const site = {
  name: 'Immigration Law Office',
  tagline: {
    en: 'Guiding your journey, protecting your future.',
    es: 'Guiando su camino, protegiendo su futuro.',
  },

  contact: {
    phoneDisplay: '(555) 123-4567',
    phoneHref: 'tel:+15551234567',
    email: 'hello@example.com',
    address: {
      street: '123 Legal Ave, Suite 400',
      city: 'City',
      region: 'ST',
      postalCode: '00000',
      country: 'US',
    },
    /**
     * Flip to true once phone, email and address above are the firm's real details.
     * Until then they are shown on the page but NOT published in structured data.
     */
    verified: false,
  },

  hours: {
    en: 'Mon–Fri, 10:00 AM – 5:00 PM',
    es: 'Lun–Vie, 10:00 AM – 5:00 PM',
    /** schema.org format, published in structured data only when contact.verified is true. */
    schema: 'Mo-Fr 10:00-17:00',
  },

  attorney: {
    /** e.g. 'Jane Doe, Esq.' — leave null until confirmed. */
    name: null as string | null,
    /** e.g. ['State Bar of California'] — shown in the footer and published in structured data. */
    barAdmissions: [] as string[],
  },

  languages: ['English', 'Spanish'],
} as const;

export function formattedAddress(): string {
  const a = site.contact.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
}
