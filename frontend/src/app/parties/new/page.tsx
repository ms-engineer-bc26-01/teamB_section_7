"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { getTodayDateInJst, toIsoFromJstDateTime } from "@/lib/datetime";
import { Party } from "@/lib/types";

export default function NewPartyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const dateValue = date || getTodayDateInJst();
      const timeValue = time || "18:00";
      const isoDate = toIsoFromJstDateTime(dateValue, timeValue);

      const created = await apiRequest<Party>("/api/parties/", {
        method: "POST",
        body: {
          title,
          date: isoDate,
          memo: memo || null,
        },
      });

      router.push(`/parties/${created.id}/items`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "パーティー作成に失敗しました",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              パーティー作成
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              新しいパーティーを作成
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← 戻る
          </Link>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              パーティー名 *
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="text"
                placeholder="例：田中家ホームパーティー"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                開催日
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                開始時間
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              メモ（任意）
              <textarea
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                rows={4}
                placeholder="テーマや注意点など"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
              />
            </label>
            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
              作成後に招待リンクが発行されます。
            </div>
            <button
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "作成中..." : "作成して招待リンクを発行"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
