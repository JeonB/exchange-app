import { z } from 'zod';

/**
 * 로그인 요청 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
