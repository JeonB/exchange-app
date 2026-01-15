import { getOrders } from '@/lib/actions/orders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDate, formatAmount, formatRate } from '@/lib/utils/format';
import type { ExchangeOrder } from '@/lib/types/exchange.types';

export default async function OrderList() {
  let ordersData: ExchangeOrder[] | undefined;
  let error: string | null = null;

  try {
    ordersData = await getOrders();
  } catch (err) {
    error = err instanceof Error ? err.message : '내역을 불러오는 중 오류가 발생했습니다.';
  }

  return (
    <Card className="bg-transparent">
      <CardContent>
        {error && <div className="py-8 text-center text-red-600">{error}</div>}

        {!error && (!ordersData || ordersData.length === 0) && (
          <div className="py-8 text-center text-gray-500">거래 내역이 없습니다.</div>
        )}

        {!error && ordersData && ordersData.length > 0 && (
          <div className="space-y-4">
            {ordersData.map((order: ExchangeOrder) => (
              <div
                key={order.orderId}
                className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-600">주문번호: {order.orderId}</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatAmount(order.fromAmount)} {order.fromCurrency} → {formatAmount(order.toAmount)}{' '}
                      {order.toCurrency}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-sm text-gray-600">환율</div>
                    <div className="text-base font-medium text-gray-900">{formatRate(order.appliedRate)}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">{formatDate(order.orderedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
