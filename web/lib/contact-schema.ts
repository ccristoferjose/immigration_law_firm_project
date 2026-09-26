import { serviceIds, type ServiceId } from './routes';

/**
 * Contact form fields and validation, shared by the browser (instant feedback)
 * and the Server Action (authoritative check). Kept dependency-free on purpose.
 * Deliberately collects no sensitive immigration details (A-numbers, dates of birth, history).
 */
export const MESSAGE_MAX = 1000;

export type ContactFields = {
  fullName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  matter: string;
  contactMethod: string;
  message: string;
  consent: string;
};

export type ErrorCode =
  | 'nameRequired'
  | 'emailRequired'
  | 'emailInvalid'
  | 'phoneInvalid'
  | 'phoneRequiredForCall'
  | 'matterRequired'
  | 'messageTooLong'
  | 'consentRequired';

export type FieldErrors = Partial<Record<keyof ContactFields, ErrorCode>>;

export const matterOptions = [...serviceIds, 'other'] as const satisfies readonly (ServiceId | 'other')[];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{7,20}$/;

export function readFields(formData: FormData): ContactFields {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  return {
    fullName: get('fullName').slice(0, 120),
    email: get('email').slice(0, 200),
    phone: get('phone').slice(0, 30),
    preferredLanguage: get('preferredLanguage') === 'es' ? 'es' : 'en',
    matter: get('matter'),
    contactMethod: get('contactMethod') === 'phone' ? 'phone' : 'email',
    message: get('message'),
    consent: get('consent'),
  };
}

export function validate(f: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.fullName.length < 2) errors.fullName = 'nameRequired';
  if (!f.email) errors.email = 'emailRequired';
  else if (!EMAIL_RE.test(f.email)) errors.email = 'emailInvalid';
  if (f.phone && (!PHONE_RE.test(f.phone) || f.phone.replace(/\D/g, '').length < 7)) errors.phone = 'phoneInvalid';
  else if (!f.phone && f.contactMethod === 'phone') errors.phone = 'phoneRequiredForCall';
  if (!(matterOptions as readonly string[]).includes(f.matter)) errors.matter = 'matterRequired';
  if (f.message.length > MESSAGE_MAX) errors.message = 'messageTooLong';
  if (f.consent !== 'yes') errors.consent = 'consentRequired';
  return errors;
}
