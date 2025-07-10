import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    variant = 'primary',
    size = 'md',
    showValue = false,
    label,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };
    
    const variantClasses = {
      primary: 'bg-lease-primary',
      success: 'bg-lease-success',
      warning: 'bg-lease-warning',
      error: 'bg-lease-error',
      info: 'bg-lease-info',
    };
    
    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center text-sm">
            {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
            {showValue && (
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out',
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };