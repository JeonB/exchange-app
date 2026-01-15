'use client';

import { useQuery } from '@tanstack/react-query';
import { getLatestExchangeRates } from '@/lib/actions/exchange';
import { Card, CardContent } from '@/components/ui/card';
import { formatRate } from '@/lib/utils/format';
import type { LatestExchangeRates } from '@/lib/types/exchange.types';

export default function ExchangeRates() {
  const { data: rates, error, isLoading } = useQuery<LatestExchangeRates>({
    queryKey: ['exchangeRates'],
    queryFn: () => getLatestExchangeRates(),
    refetchInterval: 10000, // 10초마다 자동 갱신
    staleTime: 5000, // 5초간 데이터를 fresh로 유지
  });

  // USD와 JPY 환율 필터링
  const usdRate = rates?.find((r) => r.currency === 'USD');
  const jpyRate = rates?.find((r) => r.currency === 'JPY');
  
  const errorMessage = error instanceof Error ? error.message : '환율 정보를 불러오는 중 오류가 발생했습니다.';

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">환율 정보</h2>
        <p className="text-gray-600 text-sm">
          실시간 환율을 확인하고 간편하게 환전하세요.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-gray-500">환율 정보를 불러오는 중...</div>
          ) : error ? (
            <div className="text-red-600">{errorMessage}</div>
          ) : (
            <div className="space-y-4">
              {usdRate && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">USD</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {formatRate(usdRate.rate)} KRW
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      usdRate.changePercentage >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}
                  >
                    {usdRate.changePercentage >= 0 ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    <span className="font-semibold">
                      {usdRate.changePercentage >= 0 ? '+' : ''}
                      {usdRate.changePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              {jpyRate && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">JPY</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {formatRate(jpyRate.rate)} KRW
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      jpyRate.changePercentage >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}
                  >
                    {jpyRate.changePercentage >= 0 ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    <span className="font-semibold">
                      {jpyRate.changePercentage >= 0 ? '+' : ''}
                      {jpyRate.changePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
