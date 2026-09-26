import type { Metadata } from 'next';
import { serviceFromSlug, ServiceView } from '@/components/pages';
import { serviceIds, servicePath, serviceSlugs } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

const locale = 'es';

type Props = { params: Promise<{ slug: string }> };

// Only the services defined in lib/routes.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceIds.map((id) => ({ slug: serviceSlugs[id][locale] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceFromSlug((await params).slug, locale);
  const c = service[locale];
  return pageMetadata({
    locale,
    title: c.metaTitle,
    description: c.metaDescription,
    paths: { en: servicePath(service.id, 'en'), es: servicePath(service.id, 'es') },
  });
}

export default async function Page({ params }: Props) {
  return <ServiceView locale={locale} slug={(await params).slug} />;
}
