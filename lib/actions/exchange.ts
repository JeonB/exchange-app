'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants/api';
import { handleServerApiResponse } from '@/lib/http';
import { quoteSchema, exchangeSchema } from '@/lib/schemas/exchange.schemas';
import type { QuoteResponse } from '@/lib/types/exchange.types';

/**
 * 인증 토큰을 가져옵니다.
 */
async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || null;
}

/**
 * 환전 견적을 조회합니다.
 */
export async function getQuote(request: unknown): Promise<QuoteResponse> {
  // Zod 스키마로 런타임 검증
  const result = quoteSchema.safeParse(request);
  
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(firstError?.message || '입력 데이터가 올바르지 않습니다.');
  }
  
  const validatedData = result.data;

  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(`${API_BASE_URL}/orders/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(validatedData),
  });

  return handleServerApiResponse<QuoteResponse>(response);
}

/**
 * 환전을 실행합니다.
 */
export async function executeExchange(request: unknown): Promise<void> {
  // Zod 스키마로 런타임 검증
  const result = exchangeSchema.safeParse(request);
  
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(firstError?.message || '입력 데이터가 올바르지 않습니다.');
  }
  
  const validatedData = result.data;

  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(validatedData),
  });

  await handleServerApiResponse<unknown>(response);
}
