import { Suspense } from 'react';
import OrderList from '@/components/history/order-list';
import Typography from '@/components/ui/typography';

export default function HistoryPage() {
  return (
    <div className="px-10 lg:px-20">
      <div className="my-5 lg:my-10">
        <Typography variant="h2">환전 내역</Typography>
        <Typography variant="span">환전 내역을 확인하실 수 있어요.</Typography>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-gray-500">로딩 중...</div>}>
        <OrderList />
      </Suspense>
    </div>
  );
}
