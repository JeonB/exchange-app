'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuote, executeExchange } from '@/lib/actions/exchange';
import { useToast } from '@/components/ui/toast';
import { formatAmount, formatRate } from '@/lib/utils/format';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Currency } from '@/lib/types/wallet.types';
import type { QuoteRequest, QuoteResponse, ExchangeRequest } from '@/lib/types/exchange.types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'EUR', 'JPY'];

export default function ExchangeForm() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [fromCurrency, setFromCurrency] = useState<Currency>('KRW');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState('');

  // Helper function to get available currencies excluding the from currency
  const getAvailableCurrencies = (exclude: Currency): Currency[] => {
    return CURRENCIES.filter((c) => c !== exclude);
  };

  // Handle fromCurrency change and ensure toCurrency is different
  const handleFromCurrencyChange = (newCurrency: Currency) => {
    setFromCurrency(newCurrency);
    setQuote(null);
    // If the new fromCurrency matches toCurrency, change toCurrency to the first available option
    if (newCurrency === toCurrency) {
      const available = getAvailableCurrencies(newCurrency);
      if (available.length > 0) {
        setToCurrency(available[0]);
      }
    }
  };

  const quoteMutation = useMutation({
    mutationFn: (request: QuoteRequest) => getQuote(request),
    onSuccess: (data) => {
      setQuote(data);
      setError('');
    },
    onError: (err: Error) => {
      setError(err.message);
      setQuote(null);
      showToast(err.message, 'error');
    },
  });

  const exchangeMutation = useMutation({
    mutationFn: (request: ExchangeRequest) => executeExchange(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setAmount('');
      setQuote(null);
      setError('');
      showToast('환전이 완료되었습니다.', 'success');
    },
    onError: (err: Error) => {
      setError(err.message);
      showToast(err.message, 'error');
    },
  });

  const handleGetQuote = () => {
    const amountValue = amount.trim();
    const parsedAmount = parseFloat(amountValue);

    if (!amountValue || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('환전 금액을 입력해주세요.');
      return;
    }

    if (fromCurrency === toCurrency) {
      setError('출금 통화와 입금 통화가 같을 수 없습니다.');
      return;
    }

    quoteMutation.mutate({
      fromCurrency,
      toCurrency,
      amount: amountValue,
    });
  };

  const handleExchange = () => {
    if (!quote) {
      setError('먼저 견적을 조회해주세요.');
      return;
    }

    exchangeMutation.mutate({
      fromCurrency,
      toCurrency,
      amount: amount.trim(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>환전하기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">출금 통화</label>
              <select
                name="fromCurrency"
                value={fromCurrency}
                onChange={(e) => handleFromCurrencyChange(e.target.value as Currency)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">입금 통화</label>
              <select
                name="toCurrency"
                value={toCurrency}
                onChange={(e) => {
                  const newToCurrency = e.target.value as Currency;
                  setToCurrency(newToCurrency);
                  setQuote(null);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {getAvailableCurrencies(fromCurrency).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
              환전 금액
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setQuote(null);
              }}
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          {quote && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-2 text-sm text-gray-600">환전 견적</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatAmount(quote.fromAmount)} {quote.fromCurrency} → {formatAmount(quote.toAmount)}{' '}
                {quote.toCurrency}
              </div>
              <div className="mt-1 text-sm text-gray-600">환율: {formatRate(quote.rate)}</div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleGetQuote}
              disabled={quoteMutation.isPending || !amount}
              className="flex-1"
            >
              {quoteMutation.isPending ? '견적 조회 중...' : '견적 조회'}
            </Button>
            <Button
              type="button"
              onClick={handleExchange}
              disabled={!quote || exchangeMutation.isPending}
              className="flex-1"
            >
              {exchangeMutation.isPending ? '환전 중...' : '환전하기'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
