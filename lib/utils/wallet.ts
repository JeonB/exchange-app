import type { Currency, Wallet } from "../types/wallet.types";
import type { ExchangeRates } from "../types/exchange.types";
import { formatAmount, formatRate } from "./format";

/**
 * 지갑에서 특정 통화의 잔액을 가져옵니다.
 */
export function getBalance(
  wallet: Wallet | undefined,
  currency: Currency
): string {
  if (!wallet) return "0.00";
  const balance = wallet.balances.find((b) => b.currency === currency);
  return balance ? formatAmount(balance.amount) : "0.00";
}

/**
 * 환율 정보에서 특정 통화 쌍의 환율을 가져옵니다.
 */
export function getRate(
  rates: ExchangeRates | undefined,
  from: Currency,
  to: Currency
): string {
  if (!rates) return "-";
  const rate = rates.rates.find(
    (r) => r.fromCurrency === from && r.toCurrency === to
  );
  return rate ? formatRate(rate.rate) : "-";
}
