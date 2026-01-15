import { getOrders } from '@/lib/actions/orders';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatAmount, formatRate } from '@/lib/utils/format';
import Typography from '@/components/ui/typography';
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
    <>
      <Card className="bg-transparen hidden md:block">
        <CardContent>
          {error && (
            <Typography variant="p" className="py-8 text-center text-red-600">
              {error}
            </Typography>
          )}

          {!error && (!ordersData || ordersData.length === 0) && (
            <Typography variant="p" className="py-8 text-center text-gray-500">
              거래 내역이 없습니다.
            </Typography>
          )}

          {!error && ordersData && ordersData.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left">
                    <Typography variant="span" className="text-gray-500">
                      거래 ID
                    </Typography>
                  </th>
                  <th className="py-3 text-left">
                    <Typography variant="span" className="text-gray-500">
                      거래 일시
                    </Typography>
                  </th>
                  <th className="py-3 text-right">
                    <Typography variant="span" className="text-gray-500">
                      매수 금액
                    </Typography>
                  </th>
                  <th className="py-3 text-right">
                    <Typography variant="span" className="text-gray-500">
                      체결 환율
                    </Typography>
                  </th>
                  <th className="py-3 text-right">
                    <Typography variant="span" className="text-gray-500">
                      매도 금액
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order: ExchangeOrder) => (
                  <tr key={order.orderId} className="border-b border-gray-100">
                    <td className="py-4">
                      <Typography variant="span" className="text-gray-900">
                        {order.orderId}
                      </Typography>
                    </td>
                    <td className="py-4">
                      <Typography variant="span" className="text-gray-600">
                        {formatDate(order.orderedAt)}
                      </Typography>
                    </td>
                    <td className="py-4 text-right">
                      <Typography variant="span" className="text-gray-900">
                        {formatAmount(order.fromAmount)}
                      </Typography>
                    </td>
                    <td className="py-4 text-right">
                      <Typography variant="span" className="text-gray-900">
                        {formatRate(order.appliedRate)}
                      </Typography>
                    </td>
                    <td className="py-4 text-right">
                      <Typography variant="span" className="text-gray-900">
                        {formatAmount(order.toAmount)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 md:hidden">
        {ordersData &&
          ordersData.length > 0 &&
          ordersData.map((order: ExchangeOrder) => (
            <div key={order.orderId} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <Typography variant="span" className="mb-1 block text-gray-600">
                    거래 ID : {order.orderId}
                  </Typography>
                  <Typography variant="h4" className="text-lg">
                    {formatAmount(order.fromAmount)} {order.fromCurrency} → {formatAmount(order.toAmount)}{' '}
                    {order.toCurrency}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="span" className="mb-1 block text-gray-600">
                    환율
                  </Typography>
                  <Typography variant="span" className="text-base font-medium text-gray-900">
                    {formatRate(order.appliedRate)}
                  </Typography>
                </div>
              </div>
              <Typography variant="span" className="mt-2 block text-gray-500">
                {formatDate(order.orderedAt)}
              </Typography>
            </div>
          ))}
      </div>
    </>
  );
}
