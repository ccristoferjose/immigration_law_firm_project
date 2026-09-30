'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { readFields, validate, type FieldErrors } from '@/lib/contact-schema';
import { defaultLocale, locales, type Locale } from '@/lib/i18n';
import { isRateLimited } from '@/lib/rate-limit';
import { pagePath } from '@/lib/routes';

export type ContactState = { errors?: FieldErrors; serverError?: boolean; rateLimited?: boolean };

/**
 * Delivers a contact request.
 *
 * There is no backend server yet, so delivery is a JSON POST to CONTACT_WEBHOOK_URL
 * (server-only; e.g. a Zapier/Make/Formspree webhook or a future API endpoint).
 * Without it, submissions are only logged in development and rejected in production
 * so that inquiries are never silently lost.
 */
async function deliver(payload: Record<string, string>): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] CONTACT_WEBHOOK_URL not set — submission not delivered (dev only):', {
        matter: payload.matter,
        preferredLanguage: payload.preferredLanguage,
      });
      return true;
    }
    console.error('[contact] CONTACT_WEBHOOK_URL is not configured.');
    return false;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    // Log the failure only — never the submitted personal data.
    console.error('[contact] delivery failed:', err instanceof Error ? err.message : 'unknown error');
    return false;
  }
}

export async function submitContact(locale: Locale, _prev: ContactState, formData: FormData): Promise<ContactState> {
  const safeLocale: Locale = locales.includes(locale) ? locale : defaultLocale;

  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get('company') ?? '')) redirect(pagePath('thankYou', safeLocale));

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  if (isRateLimited(ip)) return { rateLimited: true };

  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) return { errors };

  const ok = await deliver({
    fullName: fields.fullName,
    email: fields.email,
    phone: fields.phone,
    preferredLanguage: fields.preferredLanguage,
    matter: fields.matter,
    contactMethod: fields.contactMethod,
    message: fields.message,
    siteLanguage: safeLocale,
    submittedAt: new Date().toISOString(),
  });
  if (!ok) return { serverError: true };

  // No form data in the URL — the thank-you page is generic.
  redirect(pagePath('thankYou', safeLocale));
}
