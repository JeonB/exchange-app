'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { login } from '@/lib/actions/auth';
import { useToast } from '@/components/ui/toast';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const redirectPath = searchParams.get('redirect') || '/';

    startTransition(async () => {
      try {
        await login({ email }, redirectPath);
      } catch (err) {
        // if (
        //   err &&
        //   typeof err === 'object' &&
        //   'digest' in err &&
        //   typeof err.digest === 'string' &&
        //   err.digest.includes('NEXT_REDIRECT')
        // ) {
        //   throw err;
        // }
        const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {/* Wi-Fi 아이콘 */}
          <svg
            className="h-12 w-12 text-blue mb-4"
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
          <h1 className="mb-2 text-3xl font-bold text-gray-700">반갑습니다.</h1>
          <p className="text-gray-600">로그인 정보를 입력해주세요.</p>
        </div>

        <div className="rounded-lg bg-gray-0 p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-600">
                이메일 주소를 입력해주세요.
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="test@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <Button type="submit" variant="cta1" size="lg" className="w-full" disabled={isPending}>
              {isPending ? '처리 중...' : '로그인 하기'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
