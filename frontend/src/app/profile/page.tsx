"use client";

import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import { decodeJwtPayload, getAuthToken, getCurrentUser } from "@/lib/auth";
import { Party, User } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("不明");
  const [partyCount, setPartyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }

    const token = getAuthToken();
    if (token) {
      const payload = decodeJwtPayload(token);
      setUserId(payload?.sub ?? "不明");
    }

    const fetchParties = async () => {
      try {
        const parties = await apiRequest<Party[]>("/api/parties/");
        setPartyCount(parties.length);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "プロフィール情報の取得に失敗しました",
        );
      }
    };

    void fetchParties();
  }, []);

  const initials = useMemo(
    () =>
      user?.display_name?.slice(0, 1) ? user.display_name.slice(0, 1) : "?",
    [user],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-semibold text-slate-900">
            {initials}
          </div>
          <p className="text-2xl font-semibold text-slate-950">
            {user?.display_name ?? "ユーザー"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {user?.email ?? "メール情報なし"}
          </p>
          <p className="mt-1 text-xs text-slate-500">ユーザーID: {userId}</p>
          <p className="mt-1 text-xs text-slate-500">
            参加パーティー数: {partyCount}
          </p>
        </div>

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              基本情報の変更
            </p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            表示名
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue={user?.display_name ?? ""}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            メールアドレス
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue={user?.email ?? ""}
            />
          </label>
          <button
            className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
          >
            変更を保存
          </button>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              パスワード変更
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              現在のパスワード
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="password"
                placeholder="••••••••"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              新しいパスワード
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="password"
                placeholder="••••••••"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            確認
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
            />
          </label>
          <button
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            type="button"
          >
            パスワードを変更
          </button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-700">
                アカウントを削除
              </p>
              <p className="mt-1 text-sm text-slate-600">
                すべてのデータが削除されます。
              </p>
            </div>
            <button
              className="rounded-2xl border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              type="button"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
