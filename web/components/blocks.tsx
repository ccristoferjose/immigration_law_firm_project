import Link from 'next/link';
import { ChevronRight, Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import ServiceCarousel from '@/components/ServiceCarousel';
import { buttonClasses } from '@/components/ui/button';
import { getDictionary } from '@/content/dictionaries';
import { services } from '@/content/services';
import type { Faq } from '@/content/types';
import type { Locale } from '@/lib/i18n';
import { servicePath, type ServiceId } from '@/lib/routes';
import { formattedAddress, maps, site } from '@/lib/site';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { cn } from '@/lib/utils';

/** Page title band used on every inner page (holds the page's only H1). */
export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="bg-gradient-to-b from-sand-100 to-sand-50 border-b border-border">
      <div className="container py-12 md:py-16">
        {children}
        <h1 className="display-serif text-4xl md:text-5xl text-brand-900 leading-tight max-w-3xl">{title}</h1>
        <span aria-hidden="true" className="accent-rule mt-5" />
        {intro && <p className="mt-4 text-lg text-brand-800/90 max-w-3xl">{intro}</p>}
      </div>
    </section>
  );
}

/** Visible breadcrumb trail + BreadcrumbList JSON-LD. The last item is the current page. */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: { name: string; path: string }[] }) {
  const d = getDictionary(locale);
  return (
    <>
      <nav aria-label={d.common.breadcrumb} className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                {last ? (
                  <span aria-current="page" className="text-brand-900">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="rounded hover:text-brand-700 hover:underline underline-offset-4">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}

/** Accessible FAQ accordion using native <details> — no client JavaScript needed. */
export function FaqList({ faqs, headingLevel = 3 }: { faqs: Faq[]; headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as 'h3' | 'h4';
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded [&::-webkit-details-marker]:hidden">
            <Heading className="font-semibold text-brand-900">{f.q}</Heading>
            <ChevronRight
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-500 transition-transform group-open:rotate-90"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-brand-800/90 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Phone / email / address / hours. `tone` switches between dark and light backgrounds. */
export function OfficeInfo({ locale, tone = 'light' }: { locale: Locale; tone?: 'light' | 'dark' }) {
  const { common } = getDictionary(locale);
  const icon = cn('h-5 w-5 shrink-0', tone === 'dark' ? 'text-accent-300' : 'text-brand-600');
  const link = 'rounded hover:underline underline-offset-4';
  return (
    <address className={cn('not-italic space-y-4', tone === 'dark' ? 'text-brand-100' : 'text-brand-800')}>
      <p className="flex items-center gap-3">
        <Phone className={icon} aria-hidden="true" />
        <span className="sr-only">{common.phone}: </span>
        <a href={site.contact.phoneHref} data-track="phone_click" data-track-location="office-info" className={link}>
          {site.contact.phoneDisplay}
        </a>
      </p>
      {site.contact.email && (
        <p className="flex items-center gap-3">
          <Mail className={icon} aria-hidden="true" />
          <span className="sr-only">{common.email}: </span>
          <a href={`mailto:${site.contact.email}`} data-track="email_click" data-track-location="office-info" className={link}>
            {site.contact.email}
          </a>
        </p>
      )}
      <p className="flex items-start gap-3">
        <MapPin className={cn(icon, 'mt-0.5')} aria-hidden="true" />
        <span>
          <span className="sr-only">{common.address}: </span>
          {formattedAddress()}
          <span className={cn('block text-sm', tone === 'dark' ? 'text-brand-200' : 'text-muted-foreground')}>
            {site.serviceArea[locale]}
          </span>
        </span>
      </p>
      <p className="flex items-center gap-3">
        <Clock className={icon} aria-hidden="true" />
        <span className="sr-only">{common.officeHours}: </span>
        {site.hours[locale]}
      </p>
    </address>
  );
}

/** Embedded map of the office plus "get directions" links for Google Maps, Apple Maps and Waze. */
export function OfficeMap({ locale, tone = 'light' }: { locale: Locale; tone?: 'light' | 'dark' }) {
  const { common } = getDictionary(locale);
  const links = [
    { href: maps.googleDirections, label: 'Google Maps' },
    { href: maps.appleDirections, label: 'Apple Maps' },
    { href: maps.wazeDirections, label: 'Waze' },
  ];
  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-border bg-sand-100 shadow-sm">
        <iframe
          src={maps.embedUrl}
          title={common.mapTitle}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-72 w-full md:h-80"
        />
      </div>
      <p className={cn('mt-4 text-sm font-semibold', tone === 'dark' ? 'text-white' : 'text-brand-900')}>
        {common.getDirections}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-track="directions_click"
              data-track-location={l.label}
              className={buttonClasses({ variant: tone === 'dark' ? 'inverse' : 'outline', size: 'sm' })}
            >
              <Navigation className="h-4 w-4" aria-hidden="true" /> {l.label}
              <span className="sr-only">{common.opensNewTab}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Service cards linking to each service page: a carousel on phones, a grid from `sm` up. */
export function ServiceCards({ locale, exclude, headingLevel = 3 }: { locale: Locale; exclude?: ServiceId; headingLevel?: 2 | 3 }) {
  const { common } = getDictionary(locale);
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const shown = services.filter((s) => s.id !== exclude);
  return (
    <ServiceCarousel items={shown.map((s) => ({ id: s.id, name: s[locale].name }))} labels={common.servicesCarousel}>
      {shown.map((s) => {
        const c = s[locale];
        return (
          <li
            key={s.id}
            id={`service-${s.id}`}
            className="relative flex w-[85%] shrink-0 snap-start flex-col rounded-lg border border-border bg-white p-6 hover:shadow-md transition-shadow sm:w-auto"
          >
            <div className="h-12 w-12 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center mb-4">
              <s.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <Heading className="text-lg font-semibold text-brand-900">
              {/* Stretched link makes the whole card clickable with a single tab stop. */}
              <Link href={servicePath(s.id, locale)} className="rounded after:absolute after:inset-0 after:content-['']">
                {c.name}
              </Link>
            </Heading>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{c.summary}</p>
            <span aria-hidden="true" className="mt-4 text-sm font-medium text-brand-700">
              {common.learnMore} →
            </span>
          </li>
        );
      })}
    </ServiceCarousel>
  );
}

/** Small "Draft — pending attorney review" banner for pages with unfinished legal/bio content. */
export function DraftNotice({ locale }: { locale: Locale }) {
  return (
    <p className="mb-8 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {getDictionary(locale).common.draftNotice}
    </p>
  );
}
