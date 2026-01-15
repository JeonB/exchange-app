'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatAmount, formatRate } from '@/lib/utils/format';
import { useExchangeForm } from '@/lib/hooks/use-exchange-form';
import Button from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Typography from '@/components/ui/typography';
import type { Currency } from '@/lib/types/wallet.types';

const CURRENCY_INFO: Record<Exclude<Currency, 'KRW'>, { flag: string; label: string }> = {
  USD: { flag: '/flags/us.svg', label: '미국 USD' },
  JPY: { flag: '/flags/jp.svg', label: '일본 JPY' },
};

export default function ExchangeForm() {
  const {
    mode,
    currency,
    amount,
    quote,
    error,
    quoteMutation,
    exchangeMutation,
    getAvailableCurrencies,
    handleCurrencyChange,
    handleModeChange,
    handleAmountChange,
    handleExchange,
  } = useExchangeForm();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPending = quoteMutation.isPending || exchangeMutation.isPending;
  const buttonText = quoteMutation.isPending
    ? '견적 조회 중...'
    : exchangeMutation.isPending
      ? '환전 중...'
      : '환전하기';

  const currentCurrencyInfo = CURRENCY_INFO[currency as Exclude<Currency, 'KRW'>];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:bg-secondary-pressed flex cursor-pointer items-center gap-2 text-lg font-semibold text-gray-700"
          >
            <Image src={currentCurrencyInfo.flag} alt={currency} width={24} height={24} className="rounded-full" />
            <span>{currency} 환전하기</span>
            <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {getAvailableCurrencies().map((curr) => {
                const info = CURRENCY_INFO[curr as Exclude<Currency, 'KRW'>];
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => {
                      handleCurrencyChange(curr);
                      setIsDropdownOpen(false);
                    }}
                    className="hover:bg-secondary-pressed flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-gray-700"
                  >
                    <Image src={info.flag} alt={curr} width={20} height={20} className="rounded-full" />
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col space-y-4 md:space-y-8">
          <div className="flex gap-2 rounded-2xl bg-white p-2 md:p-3">
            <Button
              type="button"
              variant={mode === 'buy' ? 'destructive' : 'transparent'}
              onClick={() => handleModeChange('buy')}
              className={`flex-1 text-sm md:text-base ${mode === 'buy' ? 'text-white' : 'text-destructive'}`}
            >
              살래요
            </Button>
            <Button
              type="button"
              variant={mode === 'sell' ? 'blue' : 'transparent'}
              onClick={() => handleModeChange('sell')}
              className={`flex-1 text-sm md:text-base ${mode === 'sell' ? 'text-white' : 'text-blue'}`}
            >
              팔래요
            </Button>
          </div>

          <div className="flex-1">
            <Typography variant="label" htmlFor="amount" className="mb-2 block md:mb-3">
              {mode === 'buy' ? '매수 금액' : '매도 금액'}
            </Typography>
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-4 md:gap-2.5 md:p-6">
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="h-6 min-w-0 flex-1 border-none bg-transparent text-right text-base text-gray-600 outline-none md:h-7 md:text-xl"
              />
              <span className="shrink-0 text-base leading-none font-bold text-gray-600 md:text-xl">
                {currency === 'USD' ? '달러' : '엔'} {mode === 'buy' ? '사기' : '팔기'}
              </span>
            </div>

            <div className="my-3 flex justify-center md:my-4.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 md:h-8 md:w-8">
                <svg
                  className="h-3.5 w-3.5 text-gray-600 md:h-4 md:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {error && (
              <Typography variant="span" className="block rounded-xl bg-red-50 p-3 text-red-600">
                {error}
              </Typography>
            )}

            <div className="space-y-2 md:space-y-3">
              <Typography variant="label" className="mb-2 block md:mb-3">
                {mode === 'buy' ? '필요 원화' : '받을 원화'}
              </Typography>
              <div className="flex items-center gap-2 rounded-xl border border-gray-500 bg-gray-100 p-4 md:gap-2.5 md:p-6">
                <span className="min-w-0 flex-1 text-right text-base leading-none text-gray-600 md:text-xl">
                  {quote ? formatAmount(quote.krwAmount) : '0'}
                </span>
                {mode === 'buy' ? (
                  <span className="shrink-0 text-base font-bold text-red-600 md:text-xl">원 필요해요</span>
                ) : (
                  <span className="shrink-0 text-base font-bold text-blue-600 md:text-xl">원 받을 수 있어요</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between">
            <div className="flex w-full justify-between border-t border-gray-200 py-2 text-xs text-gray-600 md:py-3 md:text-sm">
              <span>적용 환율</span>
              <span>
                1 {currency} = {quote ? formatRate(quote.appliedRate) : '0.00'} 원
              </span>
            </div>
            <Button
              type="button"
              variant="cta1"
              onClick={handleExchange}
              disabled={!amount || !quote || isPending}
              className="w-full"
              size="lg"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
