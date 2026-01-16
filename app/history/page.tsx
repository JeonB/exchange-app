import { Suspense } from 'react';
import OrderList from '@/components/history/order-list';
import Typography from '@/components/ui/typography';

export default function HistoryPage() {
  return (
    <div className="flex h-full flex-1 flex-col px-4 md:px-6 lg:px-10 xl:px-20">
      <div className="my-4 md:my-5 lg:my-10">
        <Typography variant="h1">환전 내역</Typography>
        <Typography variant="h4" className="font-normal text-gray-700">
          환전 내역을 확인하실 수 있어요.
        </Typography>
      </div>

      <Suspense
        fallback={
          <div className="flex h-full flex-1 items-center justify-center pb-40 text-center text-gray-500">
            로딩 중...
          </div>
        }
      >
        <OrderList />
      </Suspense>
    </div>
  );
}
