'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants/api';
import { handleServerApiResponse } from '@/lib/http';
import { quoteSchema, exchangeSchema } from '@/lib/schemas/exchange.schemas';
import type { QuoteResponse, LatestExchangeRates } from '@/lib/types/exchange.types';

/**
 * 인증 토큰을 가져옵니다.
 */
async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

/**
 * 최신 환율을 조회합니다.
 * GET /exchange-rates/latest
 */
export async function getLatestExchangeRates(): Promise<LatestExchangeRates> {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(`${API_BASE_URL}/exchange-rates/latest`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 }, // 1분마다 재검증
  });

  return handleServerApiResponse<LatestExchangeRates>(response);
}

/**
 * 환전 견적을 조회합니다.
 * GET /orders/quote
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

  // 쿼리 파라미터로 변환
  const quoteUrl = new URL(`${API_BASE_URL}/orders/quote`);
  quoteUrl.searchParams.set('fromCurrency', validatedData.fromCurrency);
  quoteUrl.searchParams.set('toCurrency', validatedData.toCurrency);
  quoteUrl.searchParams.set('forexAmount', validatedData.forexAmount.toString());

  // 개발 환경에서만 요청 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log('Quote API Request:', {
      url: quoteUrl.toString(),
      method: 'GET',
      params: validatedData,
    });
  }

  const response = await fetch(quoteUrl.toString(), {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleServerApiResponse<QuoteResponse>(response);
}

/**
 * 환전을 실행합니다.
 * POST /orders
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

  // 개발 환경에서만 요청 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log('Exchange API Request:', {
      url: `${API_BASE_URL}/orders`,
      method: 'POST',
      body: validatedData,
    });
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      exchangeRateId: validatedData.exchangeRateId,
      fromCurrency: validatedData.fromCurrency,
      toCurrency: validatedData.toCurrency,
      forexAmount: validatedData.forexAmount,
    }),
  });

  await handleServerApiResponse<unknown>(response);
}
