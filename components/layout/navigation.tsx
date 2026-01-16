'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/actions/auth';
import Button from '@/components/ui/button';
import Link from 'next/link';
import Typography from '../ui/typography';

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

  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-300 bg-white px-4 py-2.5 md:py-3 lg:px-10 lg:py-4">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 md:gap-2">
          <svg
            className="text-blue h-4 w-4 md:h-5 md:w-5"
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
          <Typography variant="h3">Exchange app</Typography>
        </div>
        <div className="flex items-center gap-2 md:gap-10">
          <Link href="/">
            <Typography
              variant="p"
              className={pathname === '/' ? 'text-cta1-hovered font-bold' : 'text-[#8899AA] hover:text-gray-900'}
            >
              환전하기
            </Typography>
          </Link>
          <Link href="/history">
            <Typography
              variant="p"
              className={pathname === '/history' ? 'text-cta1-hovered font-bold' : 'text-[#8899AA] hover:text-gray-900'}
            >
              환전 내역
            </Typography>
          </Link>
          <Button variant="blue" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
            <Typography variant="p" className="font-semibold text-white">
              Log out
            </Typography>
          </Button>
        </div>
      </div>
    </nav>
  );
}
