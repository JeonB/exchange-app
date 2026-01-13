import { getExchangeRates } from '@/lib/actions/wallet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatRate } from '@/lib/utils/format';
import type { ExchangeRates } from '@/lib/types/exchange.types';

export default async function ExchangeRates() {
  let rates: ExchangeRates | undefined;
  let error: string | null = null;

  try {
    rates = await getExchangeRates();
  } catch (err) {
    error = err instanceof Error ? err.message : '환율 정보를 불러오는 중 오류가 발생했습니다.';
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>실시간 환율</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {rates?.rates.map((rate) => (
              <div key={`${rate.fromCurrency}-${rate.toCurrency}`} className="text-sm">
                <div className="text-gray-600">
                  {rate.fromCurrency} → {rate.toCurrency}
                </div>
                <div className="text-lg font-semibold text-gray-900">{formatRate(rate.rate)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
