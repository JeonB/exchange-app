export type Currency = 'KRW' | 'USD' | 'EUR' | 'JPY';

/**
 * 개별 지갑 정보
 */
export type WalletItem = {
  walletId: number;
  currency: Currency;
  balance: number; // number 타입
};

/**
 * 지갑 정보 응답 (API 응답 구조)
 */
export type Wallet = {
  totalKrwBalance: number;
  wallets: WalletItem[];
};

/**
 * 하위 호환성을 위한 타입 (deprecated)
 * @deprecated Wallet.wallets를 사용하세요
 */
export type WalletBalance = {
  currency: Currency;
  amount: string;
};
