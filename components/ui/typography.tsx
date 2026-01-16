import { type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/utils/cn';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'button';

type TypographyProps = {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
};

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-2xl md:text-[32px] xl:text-[40px] font-bold text-gray-700 leading-[1.33]',
  h2: 'text-xl font-medium text-gray-600 md:text-2xl lg:text-[32px]',
  h3: 'text-lg md:text-xl xl:text-2xl font-bold text-gray-800',
  h4: 'text-base md:text-lg xl:text-xl font-semibold text-gray-600 leading-[1.33]',
  h5: 'text-sm md:text-base font-normal text-gray-600 leading-[1.33]',
  button: 'text-sm md:text-base xl:text-[22px] font-bold text-white leading-[1.33]',
  p: 'text-sm md:text-base xl:text-xl font-medium text-gray-600',
  span: 'text-xs md:text-sm text-gray-600 font-normal leading-normal',
};

const defaultTags: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  button: 'p',
  p: 'p',
  span: 'span',
};

export default function Typography({ variant = 'p', as, children, className, htmlFor }: TypographyProps) {
  const Component = as || defaultTags[variant];

  return (
    <Component
      className={cn(variantStyles[variant], className)}
      {...(Component === 'label' && htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Component>
  );
}
