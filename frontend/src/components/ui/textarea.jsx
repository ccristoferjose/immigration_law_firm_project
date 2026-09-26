import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
