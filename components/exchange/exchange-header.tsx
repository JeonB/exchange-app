import Navigation from '@/components/layout/navigation';

export default function ExchangeHeader() {
  return (
    <div className="mb-8">
      <Navigation />
      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          환전 하기 - 환율 정보 화면
        </h1>
      </div>
    </div>
  );
}
