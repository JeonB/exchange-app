import { ErrorCode } from "./api.types";

export type AppError = {
  code: string;
  message: string;
  data: Record<string, string> | null;
};

export type ErrorHandler = (error: AppError) => void;

/**
 * 에러 코드에 따른 사용자 친화적 메시지를 반환합니다.
 */
export function getErrorMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCode.UNAUTHORIZED:
      return "인증이 필요합니다. 다시 로그인해주세요.";
    case ErrorCode.WALLET_INSUFFICIENT_BALANCE:
      return "지갑의 잔액이 부족합니다.";
    case ErrorCode.VALIDATION_ERROR:
      return error.message || "입력한 정보를 확인해주세요.";
    case ErrorCode.BAD_REQUEST:
      return error.message || "잘못된 요청입니다.";
    default:
      return (
        error.message ||
        "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
  }
}

/**
 * 인증 에러인지 확인합니다.
 */
export function isAuthError(error: AppError): boolean {
  return error.code === ErrorCode.UNAUTHORIZED;
}
