import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';

type TypographyProps = {
  variant?: TypographyVariant;
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
};

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-2xl font-bold text-gray-900',
  h3: 'text-xl font-semibold text-gray-900',
  h4: 'text-lg font-semibold text-gray-900',
  h5: 'text-base font-medium text-gray-900',
  h6: 'text-sm font-medium text-gray-900',
  p: 'text-base text-gray-700',
  span: 'text-sm text-gray-600',
  label: 'text-sm font-medium text-gray-700',
};

const defaultTags: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  span: 'span',
  label: 'label',
};

export default function Typography({
  variant = 'p',
  as,
  children,
  className,
  htmlFor,
}: TypographyProps) {
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
