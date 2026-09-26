import Link from 'next/link';
import { getDictionary } from '@/content/dictionaries';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { pagePath, servicePath } from '@/lib/routes';
import { formattedAddress, site } from '@/lib/site';

function FooterList({ heading, links }: { heading: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{heading}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="rounded hover:text-white hover:underline underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const { footer, nav, common } = d;

  return (
    <footer className="bg-brand-950 text-brand-200 text-sm">
      <div className="container py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <FooterList
          heading={footer.navHeading}
          links={[
            { href: pagePath('home', locale), label: nav.home },
            { href: pagePath('about', locale), label: nav.about },
            { href: pagePath('services', locale), label: nav.services },
            { href: pagePath('resources', locale), label: nav.resources },
            { href: pagePath('faq', locale), label: nav.faq },
            { href: pagePath('contact', locale), label: nav.contact },
          ]}
        />
        <FooterList
          heading={footer.servicesHeading}
          links={services.map((s) => ({ href: servicePath(s.id, locale), label: s[locale].name }))}
        />
        <FooterList
          heading={footer.legalHeading}
          links={[
            { href: pagePath('privacy', locale), label: footer.privacy },
            { href: pagePath('terms', locale), label: footer.terms },
            { href: pagePath('disclaimer', locale), label: footer.disclaimer },
            { href: pagePath('accessibility', locale), label: footer.accessibility },
          ]}
        />
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{footer.contactHeading}</h2>
          <address className="mt-4 not-italic space-y-2">
            <p>
              <a
                href={site.contact.phoneHref}
                data-track="phone_click"
                data-track-location="footer"
                className="rounded hover:text-white hover:underline underline-offset-4"
              >
                {site.contact.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${site.contact.email}`}
                data-track="email_click"
                data-track-location="footer"
                className="rounded hover:text-white hover:underline underline-offset-4"
              >
                {site.contact.email}
              </a>
            </p>
            <p>{formattedAddress()}</p>
            <p>
              <span className="sr-only">{common.officeHours}: </span>
              {site.hours[locale]}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="container py-6 space-y-3 text-xs text-brand-300">
          <p>
            <strong className="text-brand-100">{footer.attorneyAdvertising}</strong> {footer.notice}
          </p>
          {site.attorney.barAdmissions.length > 0 && (
            <p>
              {footer.barPrefix} {site.attorney.name ? `${site.attorney.name} — ` : ''}
              {site.attorney.barAdmissions.join(', ')}
            </p>
          )}
          <p>
            &copy; {new Date().getFullYear()} {site.name}. {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
