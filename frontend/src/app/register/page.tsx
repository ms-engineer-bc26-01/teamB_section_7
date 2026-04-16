"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiRequest } from "@/lib/api";
import { setAuthToken, setCurrentUser } from "@/lib/auth";
import { joinPartyWithInviteToken } from "@/lib/invite";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { AuthTokenResponse, User } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInviteToken(params.get("inviteToken"));
  }, []);

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      const user = await apiRequest<User>("/api/auth/register", {
        method: "POST",
        useAuth: false,
        body: {
          email: data.email,
          password: data.password,
          display_name: data.display_name,
        },
      });

      const loginResponse = await apiRequest<AuthTokenResponse>(
        "/api/auth/login",
        {
          method: "POST",
          useAuth: false,
          body: { email: data.email, password: data.password },
        },
      );

      setCurrentUser(user);
      setAuthToken(loginResponse.access_token);

      if (inviteToken) {
        const party = await joinPartyWithInviteToken(inviteToken);
        router.push(`/parties/${party.id}/items`);
        return;
      }

      router.push("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "登録に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">📝</div>
          <p className="text-2xl font-semibold">新規登録</p>
          <p className="mt-2 text-sm text-slate-600">
            アカウントを作成してパーティーに参加しましょう。
          </p>
        </div>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {serverError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600"
            >
              {serverError}
            </p>
          )}
          <div>
            <label
              htmlFor="display_name"
              className="block text-sm font-medium text-slate-700"
            >
              表示名
            </label>
            <input
              id="display_name"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="text"
              placeholder="田中 健太"
              {...register("display_name")}
            />
            {errors.display_name && (
              <p role="alert" className="mt-1 text-xs text-red-500">
                {errors.display_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="email"
              placeholder="example@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              パスワード
            </label>
            <input
              id="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p role="alert" className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-slate-700"
            >
              パスワード確認
            </label>
            <input
              id="confirm_password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p role="alert" className="mt-1 text-xs text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <button
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "新規登録"}
          </button>

          <div className="text-center text-sm text-slate-600">
            すでにアカウントをお持ちですか？{" "}
            <Link
              href={
                inviteToken
                  ? `/login?inviteToken=${encodeURIComponent(inviteToken)}`
                  : "/login"
              }
              className="font-semibold text-slate-900 hover:underline"
            >
              ログイン
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
