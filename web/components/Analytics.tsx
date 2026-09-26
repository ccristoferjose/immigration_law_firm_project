'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { GA_ID, track, type AnalyticsEvent } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';

const allowedEvents: AnalyticsEvent[] = ['cta_click', 'phone_click', 'email_click', 'language_select'];

/**
 * Loads Google Analytics only when NEXT_PUBLIC_GA_ID is set, and tracks clicks on
 * elements marked with `data-track="<event>"` (plus optional `data-track-location`).
 * Using a single delegated listener keeps the tracked links as Server Components.
 */
export default function Analytics({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (!GA_ID) return;
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      const event = el?.dataset.track as AnalyticsEvent | undefined;
      if (!el || !event || !allowedEvents.includes(event)) return;
      track(event, { location: el.dataset.trackLocation, locale });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [locale]);

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
