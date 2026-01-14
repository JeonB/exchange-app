import { Suspense } from "react";
import ExchangeHeader from "@/components/exchange/exchange-header";
import WalletBalance from "@/components/exchange/wallet-balance";
import ExchangeRates from "@/components/exchange/exchange-rates";
import ExchangeForm from "@/components/exchange/exchange-form";

export default function ExchangePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ExchangeHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 좌측: 환율 정보 + 지갑 */}
          <div className="space-y-6">
            <Suspense
              fallback={<div className="text-gray-500 mb-6">로딩 중...</div>}
            >
              <ExchangeRates />
            </Suspense>

            <Suspense
              fallback={<div className="text-gray-500 mb-6">로딩 중...</div>}
            >
              <WalletBalance />
            </Suspense>
          </div>

          {/* 우측: 환전 폼 */}
          <div>
            <ExchangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}
