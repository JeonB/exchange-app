import { Suspense } from 'react';
import OrderList from '@/components/history/order-list';

export default function HistoryPage() {
  return (
    <div className="px-10 lg:px-20">
      <div className="my-5 lg:my-10">
        <h2 className="text-2xl font-bold text-gray-900">환율 정보</h2>
        <p className="text-sm text-gray-600">실시간 환율을 확인하고 간편하게 환전하세요.</p>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-gray-500">로딩 중...</div>}>
        <OrderList />
      </Suspense>
    </div>
  );
}
