import { useQuery } from '@tanstack/react-query';
import type { ExchangeRates } from '../types/exchange.types';
import type { ApiResponse } from '../types/api.types';

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch('/api/exchange-rates');
  const data: ApiResponse<ExchangeRates> = await response.json();

  if (!response.ok || data.code !== 'OK') {
    throw new Error(data.message || '환율 조회에 실패했습니다.');
  }

  return data.data as ExchangeRates;
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60, // Refetch every 1 minute
  });
}
