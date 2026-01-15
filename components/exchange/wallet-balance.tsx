'use client';

import { useQuery } from '@tanstack/react-query';
import { getWallet } from '@/lib/actions/wallet';
import { getLatestExchangeRates } from '@/lib/actions/exchange';
import { Card, CardContent } from '@/components/ui/card';
import { getBalance } from '@/lib/utils/wallet';
import { formatAmount } from '@/lib/utils/format';
import Typography from '@/components/ui/typography';
import type { Currency, Wallet } from '@/lib/types/wallet.types';
import type { LatestExchangeRates } from '@/lib/types/exchange.types';

const DISPLAY_CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY'];

/**
 * 총 보유 자산을 KRW 기준으로 실시간 환율을 반영하여 계산합니다.
 */
function calculateTotalAssets(wallet: Wallet | undefined, rates: LatestExchangeRates | undefined): string {
  if (!wallet || !wallet.wallets || wallet.wallets.length === 0) {
    return '0.00';
  }

  let totalKRW = 0;

  for (const walletItem of wallet.wallets) {
    const amount = walletItem.balance;

    if (walletItem.currency === 'KRW') {
      totalKRW += amount;
    } else if (rates) {
      // 실시간 환율을 사용하여 KRW로 변환
      const rate = rates.find((r) => r.currency === walletItem.currency);
      if (rate) {
        totalKRW += amount * rate.rate;
      }
    }
  }

  return formatAmount(totalKRW);
}

export default function WalletBalance() {
  const {
    data: wallet,
    error: walletError,
    isLoading: walletLoading,
  } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => getWallet(),
  });

  const { data: rates } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => getLatestExchangeRates(),
    refetchInterval: 5000, // 5초마다 환율 갱신
  });

  const error = walletError instanceof Error ? walletError.message : null;
  const totalAssets = calculateTotalAssets(wallet, rates);

  return (
    <Card className="flex h-full flex-col">
      <CardContent>
        {walletLoading ? (
          <Typography variant="span" className="text-gray-500">
            지갑 정보를 불러오는 중...
          </Typography>
        ) : error ? (
          <Typography variant="span" className="text-red-600">
            {error}
          </Typography>
        ) : (
          <>
            <div className="flex-1">
              <Typography variant="h3" className="mb-4 text-lg">
                내 지갑
              </Typography>
              <div className="space-y-3">
                {DISPLAY_CURRENCIES.map((currency) => {
                  const balance = getBalance(wallet, currency);
                  const symbol = currency === 'KRW' ? '₩' : currency === 'USD' ? '$' : currency === 'JPY' ? '¥' : '₩';
                  return (
                    <div key={currency} className="flex items-center justify-between">
                      <Typography variant="span">{currency}</Typography>
                      <Typography variant="h4" className="text-lg">
                        {symbol} {formatAmount(balance, 2, 2)}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <Typography variant="span" className="font-medium">
                  총 보유 자산
                </Typography>
                <Typography variant="h3" className="text-blue text-xl">
                  ₩ {totalAssets}
                </Typography>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
