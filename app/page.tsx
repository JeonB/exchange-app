import WalletBalance from '@/components/exchange/wallet-balance';
import ExchangeRates from '@/components/exchange/exchange-rates';
import ExchangeForm from '@/components/exchange/exchange-form';
import Navigation from '@/components/layout/navigation';

export default function ExchangePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Navigation />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 좌측: 환율 정보 + 지갑 */}
          <div className="space-y-6">
            <ExchangeRates />
            <WalletBalance />
          </div>

          {/* 우측: 환전 폼 */}
          <div>
            <ExchangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}
