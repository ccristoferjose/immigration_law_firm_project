'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

type Slide = { src: StaticImageData; caption: string; alt: string };
type Labels = { previous: string; next: string; pause: string; play: string; slideOf: string };

const INTERVAL_MS = 6000;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/**
 * Auto-advancing image carousel (same fade animation as before).
 * Accessibility: pause/play control, pauses on hover/focus, no autoplay when the
 * user prefers reduced motion, and slide changes are announced politely.
 */
export default function Carousel({ slides, labels }: { slides: Slide[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
  // null = the visitor hasn't pressed play/pause; default to autoplay unless reduced motion is preferred.
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;

  useEffect(() => {
    if (!playing || hovered) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [playing, hovered, slides.length]);

  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);
  const control =
    'h-10 w-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-brand-900 shadow';

  return (
    <div
      className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="aspect-[16/9] relative bg-black">
        {slides.map((s, i) => (
          <Image
            key={s.caption}
            src={s.src}
            alt={i === index ? s.alt : ''}
            aria-hidden={i !== index}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            placeholder="blur"
            className={`object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 pb-16 sm:pb-6 bg-gradient-to-t from-black/75 to-transparent text-white"
          aria-live={playing && !hovered ? 'off' : 'polite'}
        >
          <p className="sr-only">
            {labels.slideOf.replace('{n}', String(index + 1)).replace('{total}', String(slides.length))}
          </p>
          <p className="font-serif text-xl">{slides[index].caption}</p>
        </div>
      </div>
      <button type="button" aria-label={labels.previous} onClick={() => go(-1)} className={`absolute left-2 top-1/2 -translate-y-1/2 ${control}`}>
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button type="button" aria-label={labels.next} onClick={() => go(1)} className={`absolute right-2 top-1/2 -translate-y-1/2 ${control}`}>
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={playing ? labels.pause : labels.play}
        onClick={() => setUserPlaying(!playing)}
        className={`absolute right-2 bottom-2 ${control}`}
      >
        {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
