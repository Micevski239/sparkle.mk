import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-dark-green mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 border rounded-md text-dark-green bg-white',
            'focus:outline-none focus:ring-2 focus:ring-dark-green focus:border-transparent',
            'placeholder:text-gray-400 resize-vertical min-h-[100px]',
            error ? 'border-red-1' : 'border-off-white-2',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
