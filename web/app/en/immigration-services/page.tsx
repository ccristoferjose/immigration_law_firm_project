import { ServicesIndexView } from '@/components/pages';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'en';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.services, paths: pages.services });

export default function Page() {
  return <ServicesIndexView locale={locale} />;
}
