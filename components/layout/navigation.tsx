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
        <div className="text-lg font-semibold text-gray-900">Exchange app</div>
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
            variant="outline"
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
