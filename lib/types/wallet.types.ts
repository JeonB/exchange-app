export type Currency = "KRW" | "USD" | "EUR" | "JPY";

export type WalletBalance = {
  currency: Currency;
  amount: string;
};

export type Wallet = {
  balances: WalletBalance[];
};
