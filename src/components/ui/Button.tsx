import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-red-1 text-white hover:bg-red-2 focus-visible:ring-red-1':
              variant === 'primary',
            'bg-dark-green text-white hover:bg-dark-green/90 focus-visible:ring-dark-green':
              variant === 'secondary',
            'border-2 border-dark-green text-dark-green hover:bg-dark-green hover:text-white':
              variant === 'outline',
            'text-dark-green hover:bg-off-white-1': variant === 'ghost',
          },
          {
            'h-8 px-3 text-sm rounded': size === 'sm',
            'h-10 px-4 text-base rounded-md': size === 'md',
            'h-12 px-6 text-lg rounded-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
