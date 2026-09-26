import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Check, Clock, Languages, MessagesSquare, Quote, Shield, Video } from 'lucide-react';
import { CtaBand, FaqList, OfficeInfo, ServiceCards } from '@/components/blocks';
import { buttonClasses } from '@/components/ui/button';
import { getDictionary } from '@/content/dictionaries';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { site } from '@/lib/site';
import attorneyImg from '@/public/images/attorney.jpg';
import documentsImg from '@/public/images/documents.jpg';
import heroImg from '@/public/images/hero-office.jpg';
import officeImg from '@/public/images/office-space.jpg';
import teamImg from '@/public/images/team-meeting.jpg';
import Carousel from './Carousel';

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <h2 id={id} className="display-serif text-3xl md:text-4xl text-brand-900">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

const trustIcons = [Languages, Shield, Video, MessagesSquare];

export default function HomePage({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const { home } = d;
  const contactHref = pagePath('contact', locale);
  const slideImages = [teamImg, officeImg, documentsImg];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1 mb-5">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" /> {home.hero.badge}
            </p>
            <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl text-brand-900 leading-tight">{site.name}</h1>
            <p className="mt-4 text-lg md:text-xl text-brand-800/80 max-w-xl">{site.tagline[locale]}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={contactHref}
                data-track="cta_click"
                data-track-location="hero"
                className={buttonClasses({ size: 'lg', className: 'w-full sm:w-auto' })}
              >
                <CalendarCheck className="h-5 w-5" aria-hidden="true" /> {home.hero.primaryCta}
              </Link>
              <Link
                href={pagePath('services', locale)}
                className={buttonClasses({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto' })}
              >
                {home.hero.secondaryCta}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" /> {site.hours[locale]}
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4" aria-hidden="true" /> {home.hero.confidential}
              </li>
            </ul>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-brand-100">
            <Image
              src={heroImg}
              alt={home.hero.imageAlt}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust / credentials — only facts the firm has stated */}
      <section aria-labelledby="trust-heading" className="border-y border-border bg-white">
        <div className="container py-10">
          <h2 id="trust-heading" className="sr-only">
            {home.trust.heading}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.trust.items.map((item, i) => {
              const Icon = trustIcons[i % trustIcons.length];
              return (
                <li key={item.title} className="flex gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-brand-900">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-heading" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading id="services-heading" title={home.services.title} subtitle={home.services.subtitle} />
          <ServiceCards locale={locale} />
        </div>
      </section>

      {/* Attorney introduction */}
      <section aria-labelledby="attorney-heading" className="py-16 md:py-24 bg-white">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={attorneyImg}
              alt={home.attorney.imageAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-brand-600">{home.attorney.eyebrow}</p>
            <h2 id="attorney-heading" className="mt-2 display-serif text-3xl md:text-4xl text-brand-900">
              {site.attorney.name ?? home.attorney.title}
            </h2>
            {home.attorney.bio.map((p) => (
              <p key={p} className="mt-4 text-brand-800/90">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3 text-sm text-brand-800">
              {home.attorney.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-brand-600" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            <Link href={pagePath('about', locale)} className={buttonClasses({ variant: 'outline', className: 'mt-8' })}>
              {home.attorney.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* How the process works */}
      <section aria-labelledby="process-heading" className="py-16 md:py-24">
        <div className="container">
          <SectionHeading id="process-heading" title={home.process.title} subtitle={home.process.subtitle} />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.process.steps.map((step, i) => (
              <li key={step.title} className="rounded-lg border border-border bg-white p-6">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 font-serif text-lg font-semibold text-white"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-brand-900">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose the firm */}
      <section aria-labelledby="why-heading" className="py-16 md:py-24 bg-white">
        <div className="container">
          <SectionHeading id="why-heading" title={home.why.title} subtitle={home.why.subtitle} />
          <ul className="grid gap-6 md:grid-cols-2">
            {home.why.items.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-lg border border-border p-6">
                <Check className="h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-brand-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Space & team carousel + testimonials */}
      <section aria-labelledby="gallery-heading" className="py-16 md:py-24 bg-brand-50">
        <div className="container">
          <SectionHeading id="gallery-heading" title={home.gallery.title} subtitle={home.gallery.subtitle} />
          <Carousel
            slides={home.gallery.slides.map((s, i) => ({ ...s, src: slideImages[i] }))}
            labels={home.gallery}
          />

          <h2 className="mt-16 mb-8 text-center display-serif text-3xl md:text-4xl text-brand-900">
            {home.testimonials.title}
          </h2>
          <ul className="grid md:grid-cols-3 gap-6">
            {home.testimonials.items.map((t) => (
              <li key={t.name}>
                <figure className="h-full rounded-lg bg-white p-6 border border-border">
                  <Quote className="h-6 w-6 text-brand-300 mb-3" aria-hidden="true" />
                  <blockquote className="text-brand-800 italic">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-brand-900">— {t.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-muted-foreground">{home.testimonials.note}</p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <SectionHeading id="faq-heading" title={home.faq.title} subtitle={home.faq.subtitle} />
          <FaqList faqs={d.generalFaqs} />
          <p className="mt-6 text-center">
            <Link href={pagePath('faq', locale)} className={buttonClasses({ variant: 'link' })}>
              {home.faq.viewAll} →
            </Link>
          </p>
        </div>
      </section>

      <CtaBand locale={locale} location="home-cta" />

      {/* Contact / office information */}
      <section aria-labelledby="contact-heading" className="py-16 md:py-24 bg-brand-900 text-white">
        <div className="container grid md:grid-cols-2 gap-10">
          <div>
            <h2 id="contact-heading" className="display-serif text-3xl md:text-4xl">
              {home.contact.title}
            </h2>
            <p className="mt-3 text-brand-200">{home.contact.subtitle}</p>
            <div className="mt-8">
              <OfficeInfo locale={locale} tone="dark" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Link
              href={contactHref}
              data-track="cta_click"
              data-track-location="home-contact"
              className={buttonClasses({ variant: 'inverse', size: 'lg' })}
            >
              {home.cta.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
