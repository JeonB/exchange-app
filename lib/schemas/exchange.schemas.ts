import { z } from 'zod';

/**
 * 통화 타입
 */
export const currencySchema = z.enum(['KRW', 'USD', 'JPY']);

/**
 * 환전 견적 요청 스키마
 * GET /orders/quote
 */
export const quoteSchema = z.object({
  fromCurrency: currencySchema,
  toCurrency: currencySchema,
  forexAmount: z.number().positive('환전 금액은 0보다 커야 합니다.'),
});

export type QuoteSchema = z.infer<typeof quoteSchema>;

/**
 * 환전 실행 요청 스키마
 * POST /orders
 */
export const exchangeSchema = z
  .object({
    exchangeRateId: z.number().int('환율 ID는 정수여야 합니다.').positive('환율 ID는 0보다 커야 합니다.'),
    fromCurrency: currencySchema,
    toCurrency: currencySchema,
    forexAmount: z.number().positive('환전 금액은 0보다 커야 합니다.'),
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: '출금 통화와 입금 통화가 같을 수 없습니다.',
    path: ['toCurrency'],
  });

export type ExchangeSchema = z.infer<typeof exchangeSchema>;
