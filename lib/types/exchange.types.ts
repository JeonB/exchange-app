import type { Currency } from './wallet.types';

/**
 * 최신 환율 조회 API 응답 타입
 * GET /exchange-rates/latest
 */
export type LatestExchangeRate = {
  exchangeRateId: number;
  currency: Currency;
  rate: number;
  changePercentage: number;
  applyDateTime: string;
};

export type LatestExchangeRates = LatestExchangeRate[];

/**
 * 기존 환율 타입 (하위 호환성 유지)
 */
export type ExchangeRate = {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: string;
  timestamp: string;
  changePercent?: string; // 변화율 (%)
  high?: string; // 최고가
  low?: string; // 최저가
};

export type ExchangeRates = {
  rates: ExchangeRate[];
};

/**
 * 견적 조회 요청
 * GET /orders/quote
 */
export type QuoteRequest = {
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number; // number 타입
};

/**
 * 견적 조회 응답
 * GET /orders/quote
 */
export type QuoteResponse = {
  krwAmount: number;
  appliedRate: number;
};

/**
 * 환전 주문 요청
 * POST /orders
 */
export type ExchangeRequest = {
  exchangeRateId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
};

/**
 * 주문 내역 항목
 * GET /orders
 */
export type ExchangeOrder = {
  orderId: number;
  fromCurrency: Currency;
  fromAmount: number; // number 타입
  toCurrency: Currency;
  toAmount: number; // number 타입
  appliedRate: number; // rate → appliedRate, number 타입
  orderedAt: string; // createdAt → orderedAt
};

/**
 * 주문 내역 조회 응답
 * GET /orders - 배열로 직접 반환
 */
export type ExchangeOrders = ExchangeOrder[];
