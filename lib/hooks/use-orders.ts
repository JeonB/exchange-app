import { useQuery } from '@tanstack/react-query';
import type { ExchangeOrders } from '../types/exchange.types';
import type { ApiResponse } from '../types/api.types';

async function fetchOrders(): Promise<ExchangeOrders> {
  const response = await fetch('/api/orders');
  const data: ApiResponse<ExchangeOrders> = await response.json();

  if (!response.ok || data.code !== 'OK') {
    throw new Error(data.message || '주문 내역 조회에 실패했습니다.');
  }

  return data.data as ExchangeOrders;
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 30, // 30 seconds
  });
}
