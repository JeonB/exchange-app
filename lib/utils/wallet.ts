import type { Currency, Wallet } from '../types/wallet.types';
import type { LatestExchangeRates } from '../types/exchange.types';
import { formatAmount, formatRate } from './format';

/**
 * 지갑에서 특정 통화의 잔액을 가져옵니다.
 */
export function getBalance(wallet: Wallet | undefined, currency: Currency): string {
  if (!wallet || !wallet.wallets) return '0.00';
  const walletItem = wallet.wallets.find((w) => w.currency === currency);
  return walletItem ? formatAmount(walletItem.balance) : '0.00';
}

/**
 * 환율 정보에서 특정 통화의 환율을 가져옵니다.
 * 새로운 API 구조 (LatestExchangeRates)를 사용합니다.
 */
export function getRate(rates: LatestExchangeRates | undefined, currency: Currency): string {
  if (!rates) return '-';
  const rate = rates.find((r) => r.currency === currency);
  return rate ? formatRate(rate.rate) : '-';
}

/**
 * 통화 코드를 한국어 이름으로 변환합니다.
 */
export function getCurrencyName(currency: Currency): string {
  const currencyNames: Record<Currency, string> = {
    KRW: '대한민국 원',
    USD: '미국 달러',
    JPY: '일본 엔화',
  };
  return currencyNames[currency] || currency;
}
