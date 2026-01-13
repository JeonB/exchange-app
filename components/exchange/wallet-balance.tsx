import { getWallet } from '@/lib/actions/wallet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getBalance } from '@/lib/utils/wallet';
import type { Currency, Wallet } from '@/lib/types/wallet.types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'EUR', 'JPY'];

export default async function WalletBalance() {
  let wallet: Wallet | undefined;
  let error: string | null = null;

  try {
    wallet = await getWallet();
  } catch (err) {
    error = err instanceof Error ? err.message : '지갑 정보를 불러오는 중 오류가 발생했습니다.';
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>지갑 잔액</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CURRENCIES.map((currency) => (
              <div key={currency} className="text-center">
                <div className="text-sm text-gray-600 mb-1">{currency}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {getBalance(wallet, currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
