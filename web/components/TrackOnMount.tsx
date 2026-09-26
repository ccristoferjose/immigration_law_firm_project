'use client';

import { useEffect } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import type { Locale } from '@/lib/i18n';

/** Fires a single, content-free analytics event when the page loads (e.g. form_submit on /thank-you). */
export default function TrackOnMount({ event, locale }: { event: AnalyticsEvent; locale: Locale }) {
  useEffect(() => {
    // Small delay so the gtag script (loaded afterInteractive) is ready.
    const t = setTimeout(() => track(event, { locale }), 1500);
    return () => clearTimeout(t);
  }, [event, locale]);
  return null;
}
