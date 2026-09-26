import type { LucideIcon } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { ServiceId } from '@/lib/routes';

export type Faq = { q: string; a: string };

export type ServiceContent = {
  /** Short name used in navigation, cards and breadcrumbs. */
  name: string;
  /** Page H1. */
  title: string;
  /** Unique <title> (the firm name is appended automatically). ~50–60 chars. */
  metaTitle: string;
  /** Unique meta description. ~140–160 chars. */
  metaDescription: string;
  /** One or two sentences for service cards. */
  summary: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** General explanation paragraphs. */
  overview: string[];
  /** Bullet list of matters the firm can help with. */
  helpWith: string[];
  /** Process overview steps. */
  process: { title: string; body: string }[];
  faqs: Faq[];
};

export type Service = {
  id: ServiceId;
  icon: LucideIcon;
} & Record<Locale, ServiceContent>;

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDoc = {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};
