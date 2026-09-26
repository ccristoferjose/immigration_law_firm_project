import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Simple native-select wrapper so we don't have to pull the full
 * Radix Select tree. Works great for forms with a handful of options.
 */
export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
