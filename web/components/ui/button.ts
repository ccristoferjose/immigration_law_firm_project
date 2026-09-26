import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  default: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'bg-brand-50 text-brand-800 hover:bg-brand-100',
  outline: 'border border-brand-200 bg-white hover:bg-brand-50 text-brand-800',
  ghost: 'hover:bg-brand-50 text-brand-800',
  inverse: 'bg-white text-brand-900 hover:bg-brand-50',
  link: 'text-brand-700 underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/**
 * Button styles, usable on <button>, <a> and next/link alike
 * (so links are never nested inside buttons).
 */
export function buttonClasses({
  variant = 'default',
  size = 'default',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
