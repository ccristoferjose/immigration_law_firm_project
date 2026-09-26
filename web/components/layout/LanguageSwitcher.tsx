'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeMeta, type Locale } from '@/lib/i18n';
import { translatePath } from '@/lib/routes';
import { cn } from '@/lib/utils';

/**
 * "English | Español" switcher. Links to the equivalent page in the other language,
 * so the selection is preserved as the visitor keeps navigating.
 */
export default function LanguageSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={cn('flex items-center text-sm', className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5 text-brand-300">
              |
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" lang={localeMeta[l].htmlLang} className="font-semibold text-brand-900 px-1 py-1">
              {localeMeta[l].label}
            </span>
          ) : (
            <Link
              href={translatePath(pathname, l)}
              hrefLang={localeMeta[l].htmlLang}
              lang={localeMeta[l].htmlLang}
              data-track="language_select"
              data-track-location={l}
              className="rounded px-1 py-1 text-brand-700 underline-offset-4 hover:underline"
            >
              {localeMeta[l].label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
