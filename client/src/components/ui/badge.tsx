import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-lease-primary text-white shadow hover:bg-lease-primary-hover',
        secondary:
          'border-transparent bg-lease-secondary text-white shadow hover:bg-lease-secondary-hover',
        success:
          'border-transparent bg-lease-success text-white shadow hover:bg-lease-success-hover',
        warning:
          'border-transparent bg-lease-warning text-white shadow hover:bg-lease-warning-hover',
        error:
          'border-transparent bg-lease-error text-white shadow hover:bg-lease-error-hover',
        info:
          'border-transparent bg-lease-info text-white shadow hover:bg-lease-info-hover',
        outline:
          'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
        ghost:
          'border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };