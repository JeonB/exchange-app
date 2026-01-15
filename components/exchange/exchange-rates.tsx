'use client';

import { useQuery } from '@tanstack/react-query';
import { getLatestExchangeRates } from '@/lib/actions/exchange';
import { Card, CardContent } from '@/components/ui/card';
import { formatRate } from '@/lib/utils/format';
import { getCurrencyName } from '@/lib/utils/wallet';
import Typography from '@/components/ui/typography';
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
        <CardContent className="pt-4 md:pt-6">
          <div className="mb-2 flex items-start justify-between md:mb-3">
            <Typography variant="h4" className="text-base md:text-lg">
              {rate.currency}
            </Typography>
            <Typography variant="span">{getCurrencyName(rate.currency)}</Typography>
          </div>
          <Typography variant="h3" className="mb-2 text-lg md:mb-3 md:text-xl">
            {formatRate(rate.rate)} KRW
          </Typography>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-red-600' : 'text-blue-600'}`}>
            {isPositive ? (
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            <Typography variant="span" className="font-semibold">
              {isPositive ? '+' : ''}
              {rate.changePercentage.toFixed(1)}%
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-4 md:mb-6">
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {isLoading ? (
          <Typography variant="span" className="col-span-2 text-gray-500">
            환율 정보를 불러오는 중...
          </Typography>
        ) : error ? (
          <Typography variant="span" className="col-span-2 text-red-600">
            {errorMessage}
          </Typography>
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
