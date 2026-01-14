"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/toast";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const redirectPath = searchParams.get("redirect") || "/";

    startTransition(async () => {
      try {
        await login({ email }, redirectPath);
        // redirect는 NEXT_REDIRECT 예외를 던지므로 여기 도달하지 않습니다
      } catch (err) {
        // NEXT_REDIRECT는 실제 에러가 아니므로 다시 던집니다
        if (err && typeof err === 'object' && 'digest' in err && typeof err.digest === 'string' && err.digest.includes('NEXT_REDIRECT')) {
          throw err;
        }
        const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다.";
        setError(errorMessage);
        showToast(errorMessage, "error");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            환전 애플리케이션
          </h1>
          <p className="text-gray-600 mb-6">이메일을 입력하여 시작하세요</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "처리 중..." : "시작하기"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
