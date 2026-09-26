import '@/app/globals.css';
import Analytics from '@/components/Analytics';
import JsonLd from '@/components/JsonLd';
import { getDictionary } from '@/content/dictionaries';
import { cormorant, inter } from '@/lib/fonts';
import { localeMeta, type Locale } from '@/lib/i18n';
import { legalServiceJsonLd } from '@/lib/structured-data';
import Footer from './Footer';
import Header from './Header';

/**
 * Shared <html>/<body> for the English and Spanish root layouts.
 * Each language has its own root layout so <html lang> is correct on every page
 * while pages stay statically rendered.
 */
export default function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { nav } = getDictionary(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col font-sans text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-brand-900 focus:shadow-lg"
        >
          {nav.skipToContent}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <JsonLd data={legalServiceJsonLd(locale)} />
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
