import type { Currency } from "./wallet.types";

export type ExchangeRate = {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: string;
  timestamp: string;
};

export type ExchangeRates = {
  rates: ExchangeRate[];
};

export type QuoteRequest = {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
};

export type QuoteResponse = {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: string;
  toAmount: string;
  rate: string;
};

export type ExchangeRequest = {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
};

export type ExchangeOrder = {
  orderId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: string;
  toAmount: string;
  rate: string;
  createdAt: string;
};

export type ExchangeOrders = {
  orders: ExchangeOrder[];
};
