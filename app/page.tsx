import WalletBalance from '@/components/exchange/wallet-balance';
import ExchangeRates from '@/components/exchange/exchange-rates';
import ExchangeForm from '@/components/exchange/exchange-form';
import Typography from '@/components/ui/typography';

export default function ExchangePage() {
  return (
    <>
      <div className="my-5 px-10 lg:my-10 lg:px-20">
        <Typography variant="h2">환율 정보</Typography>
        <Typography variant="span">실시간 환율을 확인하고 간편하게 환전하세요.</Typography>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 px-10 lg:grid-cols-2 lg:px-20">
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
