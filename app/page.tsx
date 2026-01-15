import WalletBalance from '@/components/exchange/wallet-balance';
import ExchangeRates from '@/components/exchange/exchange-rates';
import ExchangeForm from '@/components/exchange/exchange-form';

export default function ExchangePage() {
  return (
    <>
      <div className="my-5 px-10 lg:my-10 lg:px-20">
        <h2 className="text-2xl font-bold text-gray-900">환율 정보</h2>
        <p className="text-sm text-gray-600">실시간 환율을 확인하고 간편하게 환전하세요.</p>
      </div>
      <div className="mt-6 grid flex-1 grid-cols-1 gap-6 px-10 pb-10 lg:grid-cols-2 lg:px-20 lg:pb-[50px]">
        {/* 좌측: 환율 정보 + 지갑 */}
        <div className="flex flex-col space-y-6">
          <ExchangeRates />
          <WalletBalance />
        </div>

        {/* 우측: 환전 폼 */}
        <ExchangeForm />
      </div>
    </>
  );
}
