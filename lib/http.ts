import { redirect } from "next/navigation";
import type { ApiResponse, ApiError } from "./types/api.types";
import {
  getErrorMessage,
  isAuthError,
  type AppError,
} from "./types/errors.types";

/**
 * 클라이언트 사이드에서 API 응답을 처리하고 에러가 있으면 적절히 처리합니다.
 * 클라이언트 컴포넌트에서만 사용하세요.
 */
export async function handleApiResponse<T>(
  response: Response,
  options?: { redirectOnAuthError?: boolean; redirectPath?: string }
): Promise<T> {
  const data: ApiResponse<T> | ApiError = await response.json();

  if (!response.ok || data.code !== "OK") {
    const error: AppError = {
      code: data.code,
      message: data.message,
      data: "data" in data && data.data ? data.data : null,
    };

    // 인증 에러 처리
    if (isAuthError(error) && options?.redirectOnAuthError !== false) {
      const path =
        options?.redirectPath ||
        (typeof window !== "undefined" ? window.location.pathname : "/");
      redirect("/login?redirect=" + encodeURIComponent(path));
    }

    throw new Error(getErrorMessage(error));
  }

  return (data as ApiResponse<T>).data as T;
}

/**
 * 서버 사이드에서 API 응답을 처리합니다.
 */
export async function handleServerApiResponse<T>(
  response: Response
): Promise<T> {
  const data: ApiResponse<T> | ApiError = await response.json();

  if (!response.ok || data.code !== "OK") {
    const error: AppError = {
      code: data.code,
      message: data.message,
      data: "data" in data && data.data ? data.data : null,
    };

    throw new Error(getErrorMessage(error));
  }

  return (data as ApiResponse<T>).data as T;
}
