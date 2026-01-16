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
      <Card className="bg-transparen hidden rounded-2xl md:block">
        <CardContent className="md:px-6 md:py-4">
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
                <tr className="border-y border-gray-200">
                  <th className="py-3 text-left">
                    <Typography variant="span">거래 ID</Typography>
                  </th>
                  <th className="py-3 text-left">
                    <Typography variant="span">거래 일시</Typography>
                  </th>
                  <th className="py-3 text-left">
                    <Typography variant="span">매수 금액</Typography>
                  </th>
                  <th className="py-3 text-left">
                    <Typography variant="span">체결 환율</Typography>
                  </th>
                  <th className="py-3 text-left">
                    <Typography variant="span">매도 금액</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order: ExchangeOrder) => (
                  <tr key={order.orderId}>
                    <td className="px-4 py-3.5">
                      <Typography variant="span" className="text-gray-700">
                        {order.orderId}
                      </Typography>
                    </td>
                    <td className="px-4 py-3.5">
                      <Typography variant="span" className="text-gray-700">
                        {formatDate(order.orderedAt)}
                      </Typography>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <Typography variant="span" className="text-gray-700">
                        {formatAmount(order.fromAmount)}
                      </Typography>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <Typography variant="span" className="text-gray-700">
                        {formatRate(order.appliedRate)}
                      </Typography>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <Typography variant="span" className="text-gray-700">
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
                  <Typography variant="span" className="mb-1 block">
                    거래 ID : {order.orderId}
                  </Typography>
                  <Typography variant="h4">
                    {formatAmount(order.fromAmount)} {order.fromCurrency} → {formatAmount(order.toAmount)}{' '}
                    {order.toCurrency}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="span" className="mb-1 block">
                    환율
                  </Typography>
                  <Typography variant="span" className="text-base font-medium text-gray-800">
                    {formatRate(order.appliedRate)}
                  </Typography>
                </div>
              </div>
              <Typography variant="span" className="mt-2 block text-gray-600">
                {formatDate(order.orderedAt)}
              </Typography>
            </div>
          ))}
      </div>
    </>
  );
}
