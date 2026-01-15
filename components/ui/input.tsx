import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = ComponentProps<'input'>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-gray-300 p-6',
        'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-gray-100',
        className,
      )}
      {...props}
    />
  );
}
