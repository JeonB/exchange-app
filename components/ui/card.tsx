import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

type CardProps = ComponentProps<'div'>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('bg-gray-0 rounded-xl border border-gray-200 shadow-sm', className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-6 py-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex h-full flex-col px-6 py-4 md:px-8 md:py-6', className)} {...props} />;
}
