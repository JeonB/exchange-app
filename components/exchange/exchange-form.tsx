'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getQuote, executeExchange, getLatestExchangeRates } from '@/lib/actions/exchange';
import { useToast } from '@/components/ui/toast';
import { formatAmount, formatRate } from '@/lib/utils/format';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Currency } from '@/lib/types/wallet.types';
import type { QuoteRequest, QuoteResponse, ExchangeRequest } from '@/lib/types/exchange.types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY'];

type ExchangeMode = 'buy' | 'sell';

export default function ExchangeForm() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [mode, setMode] = useState<ExchangeMode>('buy');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState('');

  // 최신 환율 조회 (exchangeRateId를 얻기 위해)
  const { data: latestRates, refetch: refetchLatestRates } = useQuery({
    queryKey: ['latestExchangeRates'],
    queryFn: () => getLatestExchangeRates(),
  });

  // Buy 모드: KRW -> USD (KRW를 사용하여 USD 구매)
  // Sell 모드: USD -> KRW (USD를 판매하여 KRW 획득)
  const fromCurrency = mode === 'buy' ? 'KRW' : currency;
  const toCurrency = mode === 'buy' ? currency : 'KRW';

  // Helper function to get available currencies for exchange (KRW 제외)
  const getAvailableCurrencies = (): Currency[] => {
    return CURRENCIES.filter((c) => c !== 'KRW');
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setQuote(null);
  };

  // Handle mode change
  const handleModeChange = (newMode: ExchangeMode) => {
    setMode(newMode);
    setQuote(null);
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

  // 자동 견적 조회를 위한 debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 이전 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const amountValue = amount.trim();
    const parsedAmount = parseFloat(amountValue);

    // 금액이 비어있거나 유효하지 않으면 견적 초기화
    if (!amountValue || isNaN(parsedAmount) || parsedAmount <= 0) {
      setQuote(null);
      setError('');
      return;
    }

    // debounce: 500ms 후 견적 조회
    debounceTimerRef.current = setTimeout(() => {
      quoteMutation.mutate({
        fromCurrency,
        toCurrency,
        forexAmount: parsedAmount,
      });
    }, 500);

    // cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [amount, fromCurrency, toCurrency]);

  const handleExchange = async () => {
    if (!quote) {
      setError('견적을 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const amountValue = parseFloat(amount.trim());
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('환전 금액을 입력해주세요.');
      return;
    }

    try {
      // 환전 실행 직전에 최신 환율을 다시 조회 (캐시 무시)
      const { data: freshRates } = await refetchLatestRates();
      
      if (!freshRates) {
        setError('환율 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      // 환전할 통화의 exchangeRateId 찾기
      // Buy 모드: toCurrency (USD 등), Sell 모드: fromCurrency (USD 등)
      const targetCurrency = mode === 'buy' ? toCurrency : fromCurrency;
      const exchangeRate = freshRates.find((rate) => rate.currency === targetCurrency);

      if (!exchangeRate) {
        setError('환율 정보를 찾을 수 없습니다.');
        return;
      }

      exchangeMutation.mutate({
        exchangeRateId: exchangeRate.exchangeRateId,
        fromCurrency,
        toCurrency,
        forexAmount: amountValue,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '환율 정보를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currency} 환전하기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Buy/Sell 버튼 */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'buy' ? 'blue' : 'secondary'}
              onClick={() => handleModeChange('buy')}
              className="flex-1"
            >
              살래요
            </Button>
            <Button
              type="button"
              variant={mode === 'sell' ? 'destructive' : 'secondary'}
              onClick={() => handleModeChange('sell')}
              className="flex-1"
            >
              팔래요
            </Button>
          </div>

          {/* 통화 선택 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">통화 선택</label>
            <select
              name="currency"
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {getAvailableCurrencies().map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* 금액 입력 */}
          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
              {mode === 'buy' ? '매수 금액' : '매도 금액'}
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={mode === 'buy' ? `30 달러 사기` : `30 달러 팔기`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          {quote && (
            <div className="space-y-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 text-sm text-gray-600">{mode === 'buy' ? '필요 원화' : '받을 원화'}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {mode === 'buy'
                    ? `${formatAmount(quote.krwAmount)} 원이 필요해요`
                    : `${formatAmount(quote.krwAmount)} 원을 받을 수 있어요`}
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                적용 환율: 1 {currency} = {formatRate(quote.appliedRate)} ₩
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="cta1"
            onClick={handleExchange}
            disabled={!amount || !quote || quoteMutation.isPending || exchangeMutation.isPending}
            className="w-full"
            size="lg"
          >
            {quoteMutation.isPending
              ? '견적 조회 중...'
              : exchangeMutation.isPending
                ? '환전 중...'
                : '환전하기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
