'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants/api';
import { handleServerApiResponse } from '@/lib/http';
import type { ExchangeOrders } from '@/lib/types/exchange.types';

/**
 * 인증 토큰을 가져옵니다.
 */
async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

/**
 * 주문 내역을 조회합니다.
 */
export async function getOrders(): Promise<ExchangeOrders> {
  const token = await getToken();

  if (!token) {
    redirect('/login');
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // 항상 최신 데이터 조회
  });

  return handleServerApiResponse<ExchangeOrders>(response);
}
