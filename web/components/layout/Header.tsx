import Link from 'next/link';
import { getDictionary } from '@/content/dictionaries';
import { buttonClasses } from '@/components/ui/button';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { site } from '@/lib/site';
import LanguageSwitcher from './LanguageSwitcher';
import { DesktopNav, MobileNav, type NavItem } from './NavLinks';

export function Logo({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <Link href={pagePath('home', locale)} className="flex items-center gap-2 rounded-md">
      <span
        aria-hidden="true"
        className="h-9 w-9 shrink-0 rounded-md bg-brand-700 text-white flex items-center justify-center font-serif text-lg font-semibold"
      >
        L
      </span>
      <span>
        <span className="block font-serif text-lg leading-tight text-brand-900">{site.name}</span>
        <span className="block text-[11px] text-muted-foreground uppercase tracking-wider">
          {d.common.attorneysAtLaw}
        </span>
        <span className="sr-only">— {d.nav.homeLink}</span>
      </span>
    </Link>
  );
}

export default function Header({ locale }: { locale: Locale }) {
  const { nav } = getDictionary(locale);
  const homeHref = pagePath('home', locale);
  const items: NavItem[] = [
    { href: homeHref, label: nav.home },
    { href: pagePath('about', locale), label: nav.about },
    { href: pagePath('services', locale), label: nav.services },
    { href: pagePath('resources', locale), label: nav.resources },
    { href: pagePath('faq', locale), label: nav.faq },
    { href: pagePath('contact', locale), label: nav.contact },
  ];
  const cta: NavItem = { href: pagePath('contact', locale), label: nav.schedule };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-border">
      <div className="container relative flex items-center justify-between gap-4 h-16">
        <Logo locale={locale} />
        <DesktopNav items={items} homeHref={homeHref} label={nav.label} />
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} label={nav.languageLabel} />
          <Link
            href={cta.href}
            data-track="cta_click"
            data-track-location="header"
            className={buttonClasses({ size: 'sm', className: 'hidden sm:inline-flex' })}
          >
            {cta.label}
          </Link>
          <MobileNav
            items={items}
            homeHref={homeHref}
            label={nav.label}
            openLabel={nav.openMenu}
            closeLabel={nav.closeMenu}
            cta={cta}
          />
        </div>
      </div>
    </header>
  );
}
