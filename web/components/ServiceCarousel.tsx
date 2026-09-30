'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceCarouselLabels = { list: string; previous: string; next: string; position: string };

/**
 * Service cards: a swipeable carousel on phones (with a list of service names that
 * shows and selects the current card) and a plain grid from the `sm` breakpoint up.
 * The cards are server-rendered and passed in as `children` (one <li> per item, in order).
 */
export default function ServiceCarousel({
  items,
  labels,
  children,
}: {
  items: { id: string; name: string }[];
  labels: ServiceCarouselLabels;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // Track which card is closest to the start of the scroll area.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const t = trackRef.current;
        if (!t) return;
        const pad = parseFloat(getComputedStyle(t).paddingLeft) || 0;
        const cards = Array.from(t.children) as HTMLElement[];
        let best = 0;
        cards.forEach((card, i) => {
          if (Math.abs(card.offsetLeft - pad - t.scrollLeft) < Math.abs(cards[best].offsetLeft - pad - t.scrollLeft)) best = i;
        });
        setActive(best);
      });
    }
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const t = trackRef.current;
    const card = t?.children[i] as HTMLElement | undefined;
    if (!t || !card) return;
    const pad = parseFloat(getComputedStyle(t).paddingLeft) || 0;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Scroll only the track horizontally — never the page.
    t.scrollTo({ left: card.offsetLeft - pad, behavior: smooth ? 'smooth' : 'auto' });
    setActive(i);
  }, []);

  const total = items.length;
  const chip = 'rounded-full border px-3 py-1.5 text-sm transition-colors';

  return (
    <div>
      <ul aria-label={labels.list} className="sm:hidden mb-5 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-controls={`service-${item.id}`}
              aria-current={i === active ? 'true' : undefined}
              className={cn(
                chip,
                i === active
                  ? 'border-brand-900 bg-brand-900 text-white'
                  : 'border-border bg-white text-brand-800 hover:border-brand-300'
              )}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      <ul
        ref={trackRef}
        className={cn(
          'relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4'
        )}
      >
        {children}
      </ul>

      <div className="sm:hidden mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand-800 disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{labels.previous}</span>
        </button>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          <span aria-hidden="true">
            {active + 1} / {total}
          </span>
          <span className="sr-only">
            {labels.position.replace('{n}', String(active + 1)).replace('{total}', String(total))}: {items[active]?.name}
          </span>
        </p>
        <button
          type="button"
          onClick={() => goTo(Math.min(total - 1, active + 1))}
          disabled={active === total - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-brand-800 disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{labels.next}</span>
        </button>
      </div>
    </div>
  );
}
