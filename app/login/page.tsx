'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { login } from '@/lib/actions/auth';
import { useToast } from '@/components/ui/toast';
import Button from '@/components/ui/button';
import Typography from '@/components/ui/typography';

function LoginForm() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // 토큰 만료 알림 표시
  useEffect(() => {
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      showToast('인증이 만료되어 로그아웃됩니다', 'info');
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const redirectPath = searchParams.get('redirect') || '/';

    startTransition(async () => {
      try {
        await login({ email }, redirectPath);
      } catch (err) {
        if (
          err &&
          typeof err === 'object' &&
          'digest' in err &&
          typeof err.digest === 'string' &&
          err.digest.includes('NEXT_REDIRECT')
        ) {
          throw err;
        }
        const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <div className="mb-6 flex flex-col items-center md:mb-8">
          {/* Wi-Fi 아이콘 */}
          <svg
            className="text-blue mb-3 h-10 w-10 md:mb-4 md:h-12 md:w-12"
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
          <Typography variant="h1" className="mb-2 text-3xl text-gray-700 md:text-4xl lg:text-5xl">
            반갑습니다.
          </Typography>
          <Typography variant="h2">로그인 정보를 입력해주세요.</Typography>
        </div>

        <div className="bg-gray-0 rounded-xl px-4 py-4 shadow-md md:px-8 md:py-6">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div>
              <Typography variant="p" htmlFor="email" className="mb-2 text-gray-600 md:mb-3">
                이메일 주소를 입력해주세요.
              </Typography>
              <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-4 md:gap-2.5 md:p-6">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="test@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-6 min-w-0 flex-1 border-none bg-transparent text-base text-gray-600 outline-none md:h-7 md:text-lg lg:text-xl"
                />
              </div>
            </div>

            {error && (
              <Typography variant="span" className="block rounded-xl bg-red-50 p-3 text-red-600">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="cta1" size="lg" className="w-full" disabled={isPending}>
              <Typography variant="button">{isPending ? '처리 중...' : '로그인 하기'}</Typography>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="mb-6 flex flex-col items-center md:mb-8">
            <svg
              className="text-blue mb-3 h-10 w-10 md:mb-4 md:h-12 md:w-12"
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
            <Typography variant="h1" className="mb-2 text-3xl text-gray-700 md:text-4xl lg:text-5xl">
              반갑습니다.
            </Typography>
            <Typography variant="h2">로그인 정보를 입력해주세요.</Typography>
          </div>
          <div className="bg-gray-0 rounded-xl px-4 py-4 shadow-md md:px-8 md:py-6">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-4 md:gap-2.5 md:p-6">
                <div className="h-6 min-w-0 flex-1 animate-pulse bg-gray-200 md:h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
