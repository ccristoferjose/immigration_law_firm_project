import HomePage from '@/components/home/HomePage';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'es';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.home, paths: pages.home, absoluteTitle: true });

export default function Page() {
  return <HomePage locale={locale} />;
}
