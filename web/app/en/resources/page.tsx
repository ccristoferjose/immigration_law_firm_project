import { ResourcesView } from '@/components/pages';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'en';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.resources, paths: pages.resources });

export default function Page() {
  return <ResourcesView locale={locale} />;
}
