"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterPage() {
  const { register: submitRegister } = useRegister();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      await submitRegister(data);
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
        {/* TODO: バックエンド連携時に Server Actions または 'use client' +
        fetch で実装 */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* サーバーエラー表示 */}
          {serverError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600"
            >
              {serverError}
            </p>
          )}

          {/* 表示名 */}
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

          {/* メールアドレス */}
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

          {/* パスワード */}
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

          {/* ✅ 追加：パスワード確認フィールド */}
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

          {/* 送信ボタン */}
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
              href="/login"
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
