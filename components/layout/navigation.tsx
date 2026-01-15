'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/actions/auth';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push('/login');
      router.refresh();
    },
  });

  return (
    <nav className="border-b border-gray-200 bg-gray-100 px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
          <div className="text-lg font-semibold text-gray-900">Exchange app</div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            환전하기
          </Link>
          <Link
            href="/history"
            className={`text-sm font-medium ${
              pathname === '/history' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            환전내역
          </Link>
          <Button
            variant="blue"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
}
