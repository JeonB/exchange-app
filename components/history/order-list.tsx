import { getOrders } from "@/lib/actions/orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate, formatAmount, formatRate } from "@/lib/utils/format";
import type { ExchangeOrder } from "@/lib/types/exchange.types";

export default async function OrderList() {
  let ordersData: ExchangeOrder[] | undefined;
  let error: string | null = null;

  try {
    ordersData = await getOrders();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "내역을 불러오는 중 오류가 발생했습니다.";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>거래 내역</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-center py-8 text-red-600">{error}</div>}

        {!error && (!ordersData || ordersData.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            거래 내역이 없습니다.
          </div>
        )}

        {!error && ordersData && ordersData.length > 0 && (
          <div className="space-y-4">
            {ordersData.map((order: ExchangeOrder) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">
                      주문번호: {order.orderId}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatAmount(order.fromAmount)} {order.fromCurrency} →{" "}
                      {formatAmount(order.toAmount)} {order.toCurrency}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">환율</div>
                    <div className="text-base font-medium text-gray-900">
                      {formatRate(order.appliedRate)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {formatDate(order.orderedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
