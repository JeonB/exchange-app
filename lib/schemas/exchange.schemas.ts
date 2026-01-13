import { z } from 'zod';

/**
 * 통화 타입
 */
export const currencySchema = z.enum(['KRW', 'USD', 'EUR', 'JPY']);

/**
 * 환전 견적 요청 스키마
 */
export const quoteSchema = z.object({
  fromCurrency: currencySchema,
  toCurrency: currencySchema,
  amount: z
    .string()
    .min(1, '환전 금액을 입력해주세요.')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: '환전 금액은 0보다 커야 합니다.' }
    ),
});

export type QuoteSchema = z.infer<typeof quoteSchema>;

/**
 * 환전 실행 요청 스키마
 */
export const exchangeSchema = z.object({
  fromCurrency: currencySchema,
  toCurrency: currencySchema,
  amount: z
    .string()
    .min(1, '환전 금액을 입력해주세요.')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: '환전 금액은 0보다 커야 합니다.' }
    ),
}).refine(
  (data) => data.fromCurrency !== data.toCurrency,
  {
    message: '출금 통화와 입금 통화가 같을 수 없습니다.',
    path: ['toCurrency'],
  }
);

export type ExchangeSchema = z.infer<typeof exchangeSchema>;
