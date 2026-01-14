'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants/api';
import { handleServerApiResponse } from '@/lib/http';
import type { Wallet } from '@/lib/types/wallet.types';
import type { LatestExchangeRates } from '@/lib/types/exchange.types';

/**
 * 인증 토큰을 가져옵니다.
 */
async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

/**
 * 지갑 정보를 조회합니다.
 */
export async function getWallet(): Promise<Wallet> {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(`${API_BASE_URL}/wallets`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // 항상 최신 데이터 조회
  });

  return handleServerApiResponse<Wallet>(response);
}

/**
 * 환율 정보를 조회합니다.
 * GET /exchange-rates/latest
 */
export async function getExchangeRates(): Promise<LatestExchangeRates> {
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
