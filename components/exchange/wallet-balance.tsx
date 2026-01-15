'use client';

import { useQuery } from '@tanstack/react-query';
import { getWallet, getExchangeRates } from '@/lib/actions/wallet';
import { getLatestExchangeRates } from '@/lib/actions/exchange';
import { Card, CardContent } from '@/components/ui/card';
import { getBalance } from '@/lib/utils/wallet';
import { formatAmount } from '@/lib/utils/format';
import type { Currency, Wallet } from '@/lib/types/wallet.types';
import type { LatestExchangeRates } from '@/lib/types/exchange.types';

const DISPLAY_CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY'];

/**
 * 총 보유 자산을 KRW 기준으로 계산합니다.
 * API에서 제공하는 totalKrwBalance를 우선 사용하고,
 * 없으면 wallets 배열을 기반으로 계산합니다.
 */
function calculateTotalAssets(
  wallet: Wallet | undefined,
  rates: LatestExchangeRates | undefined
): string {
  if (!wallet) return '0.00';

  // API에서 제공하는 totalKrwBalance가 있으면 사용
  if (wallet.totalKrwBalance !== undefined) {
    return formatAmount(wallet.totalKrwBalance);
  }

  // totalKrwBalance가 없으면 wallets 배열을 기반으로 계산
  if (!rates || !wallet.wallets || wallet.wallets.length === 0) {
    return '0.00';
  }

  let totalKRW = 0;

  for (const walletItem of wallet.wallets) {
    const amount = walletItem.balance; // 이미 number 타입

    if (walletItem.currency === 'KRW') {
      totalKRW += amount;
    } else {
      // 다른 통화를 KRW로 변환
      const rate = rates.find((r) => r.currency === walletItem.currency);
      if (rate) {
        totalKRW += amount * rate.rate;
      }
    }
  }

  return formatAmount(totalKRW);
}

export default function WalletBalance() {
  const { data: wallet, error: walletError, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => getWallet(),
  });

  const { data: rates } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => getLatestExchangeRates(),
  });

  const error = walletError instanceof Error ? walletError.message : null;
  const totalAssets = calculateTotalAssets(wallet, rates);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {walletLoading ? (
          <div className="text-gray-500">지갑 정보를 불러오는 중...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">내 지갑</h3>
            <div className="space-y-3">
              {DISPLAY_CURRENCIES.map((currency) => {
                const balance = getBalance(wallet, currency);
                const symbol = currency === 'KRW' ? '₩' : currency === 'USD' ? '$' : currency === 'JPY' ? '¥' : '₩';
                return (
                  <div key={currency} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{currency}</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {symbol} {balance}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">총 보유 자산</span>
                <span className="text-xl font-bold text-gray-900">₩ {totalAssets}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
