"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { decodeJwtPayload, getAuthToken } from "@/lib/auth";
import {
  getTodayDateInJst,
  splitIsoToJstDateTime,
  toIsoFromJstDateTime,
} from "@/lib/datetime";
import { Party } from "@/lib/types";

export default function SettingsPage() {
  const params = useParams<{ id: string }>();
  const partyId = params.id;
  const router = useRouter();

  const [party, setParty] = useState<Party | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const data = await apiRequest<Party>(`/api/parties/${partyId}`);
        const token = getAuthToken();
        const currentUserId = token ? decodeJwtPayload(token)?.sub : undefined;

        if (!currentUserId || currentUserId !== data.owner_id) {
          setParty(data);
          setIsForbidden(true);
          setError("アクセス権限がありません");
          return;
        }

        const dateTime = splitIsoToJstDateTime(data.date);

        setParty(data);
        setTitle(data.title);
        setMemo(data.memo ?? "");
        setDate(dateTime.date);
        setTime(dateTime.time);
        setIsForbidden(false);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "パーティー情報の取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (partyId) {
      void fetchParty();
    }
  }, [partyId]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const dateValue = date || getTodayDateInJst();
      const timeValue = time || "18:00";
      const isoDate = toIsoFromJstDateTime(dateValue, timeValue);

      await apiRequest(`/api/parties/${partyId}`, {
        method: "PATCH",
        body: {
          title,
          date: isoDate,
          memo: memo || null,
        },
      });
      router.push(`/parties/${partyId}/items`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "パーティー更新に失敗しました",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await apiRequest(`/api/parties/${partyId}`, {
        method: "DELETE",
      });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "パーティー削除に失敗しました",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoading && isForbidden) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              パーティー設定
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">
              {party?.title ?? "パーティー"}
            </h1>
          </div>

          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 shadow-sm">
            <p className="text-base font-semibold text-rose-700">
              アクセス権限がありません
            </p>
            <p className="mt-2 text-sm text-rose-700/80">
              この画面は主催者のみ利用できます。
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              パーティー設定
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {party?.title ?? "パーティー"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              パーティーID: {partyId}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← 戻る
          </Link>
        </div>

        <form
          className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6"
          onSubmit={handleSave}
        >
          {isLoading && <p className="text-sm text-slate-600">読み込み中...</p>}
          <div>
            <p className="text-sm font-semibold text-slate-700">基本情報</p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            パーティー名
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              日付
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                type="date"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              開始時間
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                type="time"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            メモ
            <textarea
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              rows={3}
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
            />
          </label>
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <button
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="submit"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "保存中..." : "変更を保存"}
          </button>
        </form>

        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">危険ゾーン</p>
          <p className="mt-3 text-sm text-rose-700/80">
            パーティーを削除すると、すべてのアイテムと参加者情報が削除されます。
          </p>
          <button
            className="mt-6 rounded-2xl border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "削除中..." : "このパーティーを削除する"}
          </button>
        </div>
      </div>
    </main>
  );
}
