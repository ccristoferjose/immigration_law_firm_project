import { AboutView } from '@/components/pages';
import { getDictionary } from '@/content/dictionaries';
import { pages } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'en';

export const metadata = pageMetadata({ locale, ...getDictionary(locale).meta.about, paths: pages.about });

export default function Page() {
  return <AboutView locale={locale} />;
}
