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
  name: 'FarFan Law Firm',
  tagline: {
    es: 'Asesoría legal de inmigración en español para familias del área metropolitana de Los Ángeles.',
    en: 'Immigration legal guidance in Spanish and English for families across the Los Angeles area.',
  },

  /** Region the firm serves, shown with the address and published as `areaServed`. */
  serviceArea: {
    es: 'Sirviendo al área metropolitana de Los Ángeles',
    en: 'Serving the Los Angeles metropolitan area',
    schema: 'Los Angeles metropolitan area',
  },

  contact: {
    phoneDisplay: '(213) 221-5099',
    phoneHref: 'tel:+12132215099',
    /** Public email address. Leave null to hide it everywhere until the firm provides one. */
    email: null as string | null,
    address: {
      street: '5800 S Eastern Ave, Suite 500',
      city: 'Commerce',
      region: 'CA',
      postalCode: '90040',
      country: 'US',
    },
    /**
     * Flip to true once phone, email and address above are the firm's real details.
     * Until then they are shown on the page but NOT published in structured data.
     */
    verified: true,
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
    barAdmissions: ['State Bar of California'] as string[],
  },

  languages: ['Spanish', 'English'],
} as const;

export function formattedAddress(): string {
  const a = site.contact.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
}

const mapsQuery = encodeURIComponent(formattedAddress());

/** Map embed and turn-by-turn directions links for the office address (no API key needed). */
export const maps = {
  embedUrl: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
  googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  appleDirections: `https://maps.apple.com/?daddr=${mapsQuery}`,
  wazeDirections: `https://waze.com/ul?q=${mapsQuery}&navigate=yes`,
};
