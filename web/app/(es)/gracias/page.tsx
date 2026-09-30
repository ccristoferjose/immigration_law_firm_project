import { ThankYouView } from '@/components/pages';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'es';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.thankYou, paths: pages.thankYou, noindex: true });

export default function Page() {
  return <ThankYouView locale={locale} />;
}
