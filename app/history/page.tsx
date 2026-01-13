import { Suspense } from "react";
import HistoryHeader from "@/components/history/history-header";
import OrderList from "@/components/history/order-list";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <HistoryHeader />
        <Suspense
          fallback={
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          }
        >
          <OrderList />
        </Suspense>
      </div>
    </div>
  );
}
