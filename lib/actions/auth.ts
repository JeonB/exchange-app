"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants/api";
import { loginSchema } from "@/lib/schemas/auth.schemas";
import type { LoginResponse } from "@/lib/types/auth.types";

/**
 * 로그인을 처리하고 토큰을 쿠키에 설정합니다.
 */
export async function login(
  body: unknown
): Promise<{ success: boolean; message: string }> {
  // Zod 스키마로 런타임 검증
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(firstError?.message || "입력 데이터가 올바르지 않습니다.");
  }

  const validatedData = result.data;

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: validatedData.email }),
  });

  const data = await response.json();

  if (!response.ok || data.code !== "OK") {
    throw new Error(data.message || "로그인에 실패했습니다.");
  }

  const loginData = data.data as LoginResponse;
  const cookieStore = await cookies();

  cookieStore.set("accessToken", loginData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { success: true, message: "로그인 성공" };
}

/**
 * 로그아웃을 처리합니다 (쿠키 삭제).
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
}
