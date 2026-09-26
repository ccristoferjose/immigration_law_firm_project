import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ExternalLink } from 'lucide-react';
import { Breadcrumbs, CtaBand, DraftNotice, FaqList, OfficeInfo, PageHeader, ServiceCards } from '@/components/blocks';
import ContactForm from '@/components/ContactForm';
import TrackOnMount from '@/components/TrackOnMount';
import { buttonClasses } from '@/components/ui/button';
import { getDictionary } from '@/content/dictionaries';
import { legalDocs, type LegalDocId } from '@/content/legal';
import { getService, services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { pagePath, serviceIdFromSlug, servicePath } from '@/lib/routes';
import attorneyImg from '@/public/images/attorney.jpg';

const h2 = 'display-serif text-3xl text-brand-900';

export function AboutView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader title={d.about.title} intro={d.about.intro} />
      <div className="container py-12 md:py-16 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="max-w-3xl">
          {d.about.sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className={h2}>{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-4 leading-relaxed text-brand-800/90">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <ul className="space-y-3 text-brand-800">
            {d.home.attorney.points.map((p) => (
              <li key={p} className="flex gap-2">
                <Check className="h-5 w-5 text-brand-600" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] rounded-lg overflow-hidden shadow-lg">
          <Image src={attorneyImg} alt={d.home.attorney.imageAlt} fill placeholder="blur" sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
        </div>
      </div>
      <CtaBand locale={locale} location="about" />
    </>
  );
}

export function ServicesIndexView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader title={d.servicesIndex.title} intro={d.servicesIndex.intro}>
        <Breadcrumbs
          locale={locale}
          items={[
            { name: d.nav.home, path: pagePath('home', locale) },
            { name: d.nav.services, path: pagePath('services', locale) },
          ]}
        />
      </PageHeader>
      <div className="container py-12 md:py-16">
        <ServiceCards locale={locale} headingLevel={2} />
        <p className="mt-10 max-w-3xl text-sm text-muted-foreground">{d.common.noGuarantee}</p>
      </div>
      <CtaBand locale={locale} location="services-index" />
    </>
  );
}

export function serviceFromSlug(slug: string, locale: Locale) {
  const id = serviceIdFromSlug(slug, locale);
  if (!id) notFound();
  return getService(id);
}

export function ServiceView({ locale, slug }: { locale: Locale; slug: string }) {
  const d = getDictionary(locale);
  const service = serviceFromSlug(slug, locale);
  const c = service[locale];

  return (
    <>
      <PageHeader title={c.title} intro={c.intro}>
        <Breadcrumbs
          locale={locale}
          items={[
            { name: d.nav.home, path: pagePath('home', locale) },
            { name: d.nav.services, path: pagePath('services', locale) },
            { name: c.name, path: servicePath(service.id, locale) },
          ]}
        />
      </PageHeader>

      <div className="container py-12 md:py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <article className="max-w-3xl">
          <section aria-labelledby="overview">
            <h2 id="overview" className={h2}>
              {d.common.overviewHeading}
            </h2>
            <div className="prose-content text-brand-800/90">
              {c.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="help" className="mt-12">
            <h2 id="help" className={h2}>
              {d.common.helpWithHeading}
            </h2>
            <ul className="mt-6 space-y-3 text-brand-800">
              {c.helpWith.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-brand-600" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="process" className="mt-12">
            <h2 id="process" className={h2}>
              {d.common.processHeading}
            </h2>
            <ol className="mt-6 space-y-6">
              {c.process.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 font-serif font-semibold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-900">{step.title}</h3>
                    <p className="mt-1 text-brand-800/90">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="faq" className="mt-12">
            <h2 id="faq" className={`${h2} mb-6`}>
              {d.common.faqHeading}
            </h2>
            <FaqList faqs={c.faqs} />
          </section>

          <p className="mt-10 rounded-md bg-muted p-4 text-sm text-muted-foreground">{d.common.noGuarantee}</p>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="font-semibold text-brand-900">{d.home.cta.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{d.home.cta.body}</p>
            <Link
              href={pagePath('contact', locale)}
              data-track="cta_click"
              data-track-location="service-sidebar"
              className={buttonClasses({ className: 'mt-4 w-full' })}
            >
              {d.nav.schedule}
            </Link>
            <div className="mt-6 text-sm">
              <OfficeInfo locale={locale} />
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related" className="bg-brand-50 py-12 md:py-16">
        <div className="container">
          <h2 id="related" className={`${h2} mb-8`}>
            {d.common.relatedServices}
          </h2>
          <ServiceCards locale={locale} exclude={service.id} />
        </div>
      </section>

      <CtaBand locale={locale} location="service-page" />
    </>
  );
}

export function ResourcesView({ locale }: { locale: Locale }) {
  const { resources: r, nav } = getDictionary(locale);
  return (
    <>
      <PageHeader title={r.title} intro={r.intro} />
      <div className="container py-12 md:py-16 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="official">
          <h2 id="official" className={h2}>
            {r.officialHeading}
          </h2>
          <ul className="mt-6 space-y-4">
            {r.links.map((l) => (
              <li key={l.href + l.title} className="rounded-lg border border-border bg-white p-5">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded font-semibold text-brand-800 hover:underline underline-offset-4"
                >
                  {l.title}
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="sr-only">{r.externalNote}</span>
                </a>
                <p className="mt-1 text-sm text-muted-foreground">{l.body}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-12">
          <section aria-labelledby="prepare">
            <h2 id="prepare" className={h2}>
              {r.prepareHeading}
            </h2>
            <ul className="mt-6 space-y-3 text-brand-800">
              {r.checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="h-5 w-5 mt-0.5 shrink-0 text-brand-600" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="scams" className="rounded-lg border border-amber-300 bg-amber-50 p-6">
            <h2 id="scams" className="text-xl font-semibold text-amber-950">
              {r.scamsHeading}
            </h2>
            <p className="mt-3 text-amber-950">{r.scamsBody}</p>
            <a
              href={r.scamsLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded font-semibold text-amber-950 underline underline-offset-4"
            >
              {r.scamsLink.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{r.externalNote}</span>
            </a>
          </section>
          <p>
            <Link href={pagePath('faq', locale)} className={buttonClasses({ variant: 'outline' })}>
              {nav.faq}
            </Link>
          </p>
        </div>
      </div>
      <CtaBand locale={locale} location="resources" />
    </>
  );
}

export function FaqView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <>
      <PageHeader title={d.faqPage.title} intro={d.faqPage.intro} />
      <div className="container max-w-3xl py-12 md:py-16">
        <section aria-labelledby="general">
          <h2 id="general" className={`${h2} mb-6`}>
            {d.faqPage.generalHeading}
          </h2>
          <FaqList faqs={d.generalFaqs} />
        </section>
        <section aria-labelledby="by-service" className="mt-16">
          <h2 id="by-service" className={h2}>
            {d.faqPage.byServiceHeading}
          </h2>
          {services.map((s) => (
            <div key={s.id} className="mt-10">
              <h3 className="mb-4 text-xl font-semibold text-brand-900">
                <Link href={servicePath(s.id, locale)} className="rounded hover:underline underline-offset-4">
                  {s[locale].name}
                </Link>
              </h3>
              <FaqList faqs={s[locale].faqs} headingLevel={4} />
            </div>
          ))}
        </section>
      </div>
      <CtaBand locale={locale} location="faq" />
    </>
  );
}

export function ContactView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const matters = [
    ...services.map((s) => ({ value: s.id, label: s[locale].name })),
    { value: 'other', label: d.form.matterOther },
  ];
  return (
    <>
      <PageHeader title={d.contactPage.title} intro={d.contactPage.intro} />
      <div className="container py-12 md:py-16 grid gap-12 lg:grid-cols-[1fr_360px]">
        <section aria-labelledby="form-heading" className="rounded-lg border border-border bg-white p-6 md:p-8">
          <h2 id="form-heading" className={`${h2} mb-6`}>
            {d.contactPage.formHeading}
          </h2>
          <ContactForm locale={locale} labels={d.form} matters={matters} />
        </section>
        <section aria-labelledby="office-heading" className="self-start rounded-lg bg-brand-900 p-6 md:p-8 text-white">
          <h2 id="office-heading" className="display-serif text-3xl">
            {d.contactPage.officeHeading}
          </h2>
          <div className="mt-6">
            <OfficeInfo locale={locale} tone="dark" />
          </div>
        </section>
      </div>
    </>
  );
}

export function ThankYouView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <div className="container max-w-2xl py-20 text-center">
      <TrackOnMount event="form_submit" locale={locale} />
      <h1 className="display-serif text-4xl text-brand-900">{d.thankYou.title}</h1>
      <p className="mt-4 text-lg text-brand-800/90">{d.thankYou.body}</p>
      <Link href={pagePath('home', locale)} className={buttonClasses({ size: 'lg', className: 'mt-8' })}>
        {d.thankYou.back}
      </Link>
    </div>
  );
}

export function LegalView({ locale, doc }: { locale: Locale; doc: LegalDocId }) {
  const content = legalDocs[doc][locale];
  return (
    <>
      <PageHeader title={content.title} intro={content.intro} />
      <div className="container max-w-3xl py-12 md:py-16">
        <DraftNotice locale={locale} />
        {content.sections.map((s) => (
          <section key={s.heading} className="mb-10">
            <h2 className="text-2xl font-semibold text-brand-900">{s.heading}</h2>
            <div className="prose-content text-brand-800/90">
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
