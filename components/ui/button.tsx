import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'blue' | 'cta1' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyles =
    'font-medium rounded-xl transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 ',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    destructive: 'bg-destructive hover:opacity-90',
    blue: 'bg-blue hover:opacity-90 text-white',
    cta1: 'bg-cta1 text-white hover:opacity-90',
    transparent: 'bg-transparent text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs md:px-3 md:py-1.5 md:text-sm',
    md: 'px-3 py-3 text-base md:px-4 md:py-4 md:text-xl',
    lg: 'px-4 py-4 text-base md:px-6 md:py-6 md:text-[22px] md:leading-[1.33]',
  };

  return <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
}
