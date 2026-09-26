'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string, homeHref: string) {
  if (href === homeHref) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop navigation links with aria-current on the active page. */
export function DesktopNav({ items, homeHref, label }: { items: NavItem[]; homeHref: string; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-5 text-sm text-brand-800">
        {items.map((item) => {
          const active = isActive(pathname, item.href, homeHref);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded py-1 hover:text-brand-600',
                  active && 'font-semibold text-brand-900 underline decoration-brand-300 decoration-2 underline-offset-8'
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mobile menu: disclosure button + panel. Closes on navigation and Escape. */
export function MobileNav({
  items,
  homeHref,
  label,
  openLabel,
  closeLabel,
  cta,
}: {
  items: NavItem[];
  homeHref: string;
  label: string;
  openLabel: string;
  closeLabel: string;
  cta: NavItem;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className={buttonClasses({ variant: 'ghost', size: 'icon' })}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-white shadow-lg"
      >
        <nav aria-label={label} className="container py-4">
          <ul className="flex flex-col">
            {items.map((item) => {
              const active = isActive(pathname, item.href, homeHref);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-3 text-base text-brand-800 hover:bg-brand-50',
                      active && 'bg-brand-50 font-semibold text-brand-900'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={cta.href}
            data-track="cta_click"
            data-track-location="mobile-menu"
            className={buttonClasses({ size: 'lg', className: 'mt-4 w-full' })}
          >
            {cta.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
