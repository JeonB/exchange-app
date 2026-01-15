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
    cache: 'no-store', // 항상 최신 데이터 조회 (환전 실행 시 최신 환율 필요)
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
 * EXCHANGE_RATE_MISMATCH 에러 발생 시 최신 환율을 조회하고 재시도합니다.
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

  // 환전 실행 함수 (재시도용)
  const attemptExchange = async (exchangeRateId: number) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exchangeRateId,
        fromCurrency: validatedData.fromCurrency,
        toCurrency: validatedData.toCurrency,
        forexAmount: validatedData.forexAmount,
      }),
    });

    const data = await response.json();

    // EXCHANGE_RATE_MISMATCH 에러인지 확인
    if (!response.ok && data.message && data.message.includes('환율 ID')) {
      // 최신 환율을 다시 조회
      const latestRates = await getLatestExchangeRates();

      // 환전할 통화의 exchangeRateId 찾기
      const targetCurrency =
        validatedData.fromCurrency === 'KRW' ? validatedData.toCurrency : validatedData.fromCurrency;
      const latestRate = latestRates.find((rate) => rate.currency === targetCurrency);

      if (!latestRate) {
        throw new Error('최신 환율 정보를 찾을 수 없습니다.');
      }

      // 최신 환율 ID로 재시도 (1회만)
      return attemptExchange(latestRate.exchangeRateId);
    }

    // 일반 에러 처리
    if (!response.ok || data.code !== 'OK') {
      const error: { code: string; message: string; data: Record<string, string> | null } = {
        code: data.code,
        message: data.message,
        data: 'data' in data && data.data ? data.data : null,
      };
      throw new Error(error.message || '환전 처리 중 오류가 발생했습니다.');
    }

    return data;
  };

  // 개발 환경에서만 요청 로깅
  if (process.env.NODE_ENV === 'development') {
    console.log('Exchange API Request:', {
      url: `${API_BASE_URL}/orders`,
      method: 'POST',
      body: validatedData,
    });
  }

  await attemptExchange(validatedData.exchangeRateId);
}
