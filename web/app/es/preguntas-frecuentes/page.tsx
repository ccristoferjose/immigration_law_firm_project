import { FaqView } from '@/components/pages';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'es';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.faq, paths: pages.faq });

export default function Page() {
  return <FaqView locale={locale} />;
}
