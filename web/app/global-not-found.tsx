import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { cormorant, inter } from '@/lib/fonts';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: `Page not found / Página no encontrada | ${site.name}`,
  robots: { index: false },
};

/** 404 for any unmatched URL. Bilingual because there is no locale context here. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white font-sans">
        <main className="container max-w-xl py-20 text-center">
          <p className="font-serif text-6xl text-brand-300">404</p>
          <h1 className="mt-4 display-serif text-4xl text-brand-900">Page not found</h1>
          <p className="mt-2 text-brand-800/90">The page you are looking for does not exist or has moved.</p>
          <p lang="es" className="mt-6 display-serif text-2xl text-brand-900">
            Página no encontrada
          </p>
          <p lang="es" className="mt-1 text-brand-800/90">
            La página que busca no existe o fue trasladada.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className={buttonClasses({ size: 'lg' })}>
              Go to home page
            </Link>
            <Link href="/es" lang="es" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
              Ir a la página de inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
