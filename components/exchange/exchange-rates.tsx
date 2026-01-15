'use client';

import { useQuery } from '@tanstack/react-query';
import { getLatestExchangeRates } from '@/lib/actions/exchange';
import { Card, CardContent } from '@/components/ui/card';
import { formatRate } from '@/lib/utils/format';
import { getCurrencyName } from '@/lib/utils/wallet';
import type { LatestExchangeRates } from '@/lib/types/exchange.types';
import type { LatestExchangeRate } from '@/lib/types/exchange.types';

export default function ExchangeRates() {
  const {
    data: rates,
    error,
    isLoading,
  } = useQuery<LatestExchangeRates>({
    queryKey: ['exchangeRates'],
    queryFn: () => getLatestExchangeRates(),
    refetchInterval: 10000, // 10초마다 자동 갱신
    staleTime: 5000, // 5초간 데이터를 fresh로 유지
  });

  // USD와 JPY 환율 필터링
  const usdRate = rates?.find((r) => r.currency === 'USD');
  const jpyRate = rates?.find((r) => r.currency === 'JPY');

  const errorMessage = error instanceof Error ? error.message : '환율 정보를 불러오는 중 오류가 발생했습니다.';

  const renderRateCard = (rate: LatestExchangeRate) => {
    const isPositive = rate.changePercentage >= 0;
    return (
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="mb-3 flex items-start justify-between">
            <div className="text-lg font-bold text-gray-900">{rate.currency}</div>
            <div className="text-sm text-gray-600">{getCurrencyName(rate.currency)}</div>
          </div>
          <div className="mb-3 text-xl font-bold text-gray-900">{formatRate(rate.rate)} KRW</div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-red-600' : 'text-blue-600'}`}>
            {isPositive ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}
              {rate.changePercentage.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 text-gray-500">환율 정보를 불러오는 중...</div>
        ) : error ? (
          <div className="col-span-2 text-red-600">{errorMessage}</div>
        ) : (
          <>
            {usdRate && renderRateCard(usdRate)}
            {jpyRate && renderRateCard(jpyRate)}
          </>
        )}
      </div>
    </div>
  );
}
