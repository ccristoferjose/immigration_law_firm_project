/**
 * Privacy-safe analytics events.
 *
 * Only these event names and these parameter values are ever sent. Never pass
 * names, emails, phone numbers, message text, case details or any other form
 * contents — the types below intentionally make that impossible.
 */
export type AnalyticsEvent =
  | 'cta_click'
  | 'phone_click'
  | 'email_click'
  | 'form_submit'
  | 'language_select'
  | 'directions_click';

export type AnalyticsParams = {
  /** Where on the page the interaction happened, e.g. 'header', 'hero', 'footer'. */
  location?: string;
  locale?: 'en' | 'es';
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const rawGaId = process.env.NEXT_PUBLIC_GA_ID;
/** GA4 measurement ID (e.g. G-XXXXXXX). Analytics is disabled unless this is set. */
export const GA_ID = rawGaId && /^G-[A-Z0-9]+$/.test(rawGaId) ? rawGaId : undefined;

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const safe: AnalyticsParams = {};
  if (params.location) safe.location = params.location.slice(0, 40);
  if (params.locale === 'en' || params.locale === 'es') safe.locale = params.locale;
  window.gtag('event', event, safe);
}
