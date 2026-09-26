import { LegalView } from '@/components/pages';
import { legalDocs } from '@/content/legal';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'es';
const doc = legalDocs.terms[locale];

export const metadata = pageMetadata({ locale, title: doc.title, description: doc.metaDescription, paths: pages.terms });

export default function Page() {
  return <LegalView locale={locale} doc="terms" />;
}
