"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiRequest } from "@/lib/api";
import { formatDateTimeInJst } from "@/lib/datetime";
import { PartyByTokenResponse } from "@/lib/types";

interface Props {
  params: { token: string };
}

export default function InvitePage({ params }: Props) {
  const [party, setParty] = useState<PartyByTokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const partyData = await apiRequest<PartyByTokenResponse>(
          `/api/parties/by-token?invite_token=${encodeURIComponent(params.token)}`,
          { useAuth: false },
        );
        setParty(partyData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "招待情報の取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchParty();
  }, [params.token]);

  const partyDateText = party ? formatDateTimeInJst(party.date) : "日時未設定";
  const partyMemberText =
    party && Number.isFinite(party.member_count)
      ? `${party.member_count}名参加`
      : "参加人数不明";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
        <div className="mb-6 text-center">
          <div className="mb-4 text-5xl">🎊</div>
          <p className="text-2xl font-semibold">招待を受け取りました</p>
          <p className="mt-3 text-sm text-slate-600">
            {isLoading
              ? "招待情報を確認しています..."
              : error
                ? "招待情報を読み込めませんでした。"
                : `${party?.title ?? "パーティー"}への招待です。`}
          </p>
        </div>
        <div className="mb-6 rounded-3xl bg-slate-50 p-5 text-left text-sm text-slate-700">
          <p className="font-semibold text-slate-900">招待パーティー</p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            {isLoading
              ? "読み込み中..."
              : party?.title ?? "不明なパーティー"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {isLoading ? "" : `${partyDateText} / ${partyMemberText}`}
          </p>
          {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        </div>

        <Link
          href="/login"
          className="mb-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          ログインして参加する
        </Link>
        <Link
          href="/register"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          新規登録して参加する
        </Link>
      </div>
    </main>
  );
}
