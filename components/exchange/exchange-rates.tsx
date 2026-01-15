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
            <Typography variant="h4">{rate.currency}</Typography>
            <Typography variant="h5">{getCurrencyName(rate.currency)}</Typography>
          </div>
          <Typography variant="h5">{formatRate(rate.rate)} KRW</Typography>
          <Typography variant="h5" className={isPositive ? 'text-red-600' : 'text-blue-600'}>
            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}
            {rate.changePercentage.toFixed(1)}%
          </Typography>
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
