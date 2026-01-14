'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/constants/api';
import { loginSchema } from '@/lib/schemas/auth.schemas';
import type { LoginResponse } from '@/lib/types/auth.types';
import { redirect } from 'next/navigation';

/**
 * 로그인을 처리하고 토큰을 쿠키에 설정합니다.
 * @param body - 로그인 요청 본문 (email 포함)
 * @param redirectPath - 로그인 성공 후 리다이렉트할 경로 (기본값: '/')
 */
export async function login(body: unknown, redirectPath: string = '/'): Promise<never> {
  // Zod 스키마로 런타임 검증
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(firstError?.message || '입력 데이터가 올바르지 않습니다.');
  }

  const validatedData = result.data;

  // API는 쿼리 파라미터로 email을 받고, body는 비어있어야 함
  const loginUrl = new URL(`${API_BASE_URL}/auth/login`);
  loginUrl.searchParams.set('email', validatedData.email);

  const response = await fetch(loginUrl.toString(), {
    method: 'POST',
    headers: {
      accept: '*/*',
    },
    // body는 빈 문자열로 전송
    body: '',
  });

  const data = await response.json();

  if (!response.ok || data.code !== 'OK') {
    // 개발 환경에서만 상세 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error('Login API Error:', {
        status: response.status,
        statusText: response.statusText,
        requestUrl: loginUrl.toString(),
        responseData: data,
      });
    }
    throw new Error(data.message || '로그인에 실패했습니다.');
  }

  const loginData = data.data as LoginResponse;
  const cookieStore = await cookies();

  cookieStore.set('token', loginData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // 서버 사이드에서 리다이렉트 (쿠키가 설정된 후)
  redirect(redirectPath);
}

/**
 * 로그아웃을 처리합니다 (쿠키 삭제).
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
