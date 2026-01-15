import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getQuote, executeExchange, getLatestExchangeRates } from '@/lib/actions/exchange';
import { useToast } from '@/components/ui/toast';
import type { Currency } from '@/lib/types/wallet.types';
import type { QuoteRequest, QuoteResponse, ExchangeRequest } from '@/lib/types/exchange.types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY'];

export type ExchangeMode = 'buy' | 'sell';

export function useExchangeForm() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [mode, setMode] = useState<ExchangeMode>('buy');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState('');

  const { data: latestRates, refetch: refetchLatestRates } = useQuery({
    queryKey: ['latestExchangeRates'],
    queryFn: () => getLatestExchangeRates(),
  });

  const fromCurrency = mode === 'buy' ? 'KRW' : currency;
  const toCurrency = mode === 'buy' ? currency : 'KRW';

  const getAvailableCurrencies = (): Currency[] => {
    return CURRENCIES.filter((c) => c !== 'KRW');
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setQuote(null);
  };

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

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const amountValue = amount.trim();
    const parsedAmount = parseFloat(amountValue);

    if (!amountValue || isNaN(parsedAmount) || parsedAmount <= 0) {
      setQuote(null);
      setError('');
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      quoteMutation.mutate({
        fromCurrency,
        toCurrency,
        forexAmount: parsedAmount,
      });
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { data: freshRates } = await refetchLatestRates();

      if (!freshRates) {
        setError('환율 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

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

  return {
    mode,
    currency,
    amount,
    quote,
    error,
    fromCurrency,
    toCurrency,
    quoteMutation,
    exchangeMutation,
    getAvailableCurrencies,
    handleCurrencyChange,
    handleModeChange,
    handleAmountChange: setAmount,
    handleExchange,
  };
}
