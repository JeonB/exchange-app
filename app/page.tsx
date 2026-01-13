import { Suspense } from "react";
import ExchangeHeader from "@/components/exchange/exchange-header";
import WalletBalance from "@/components/exchange/wallet-balance";
import ExchangeRates from "@/components/exchange/exchange-rates";
import ExchangeForm from "@/components/exchange/exchange-form";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function ExchangePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ExchangeHeader />

        <Suspense
          fallback={<div className="text-gray-500 mb-6">로딩 중...</div>}
        >
          <WalletBalance />
        </Suspense>

        <Suspense
          fallback={<div className="text-gray-500 mb-6">로딩 중...</div>}
        >
          <ExchangeRates />
        </Suspense>

        <ExchangeForm />

        <div className="mt-6 text-center">
          <Link href="/history">
            <Button variant="outline">내역 보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
