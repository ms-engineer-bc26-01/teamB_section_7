"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { Party } from "@/lib/types";

export default function MembersPage() {
  const params = useParams<{ id: string }>();
  const partyId = params.id;

  const [party, setParty] = useState<Party | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const data = await apiRequest<Party>(`/api/parties/${partyId}`);
        setParty(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "参加者情報の取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (partyId) {
      void fetchParty();
    }
  }, [partyId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const inviteUrl = party ? `${origin}/invite/${party.invite_token}` : "";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">参加者管理</p>
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

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {isLoading && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-600">
            読み込み中...
          </div>
        )}

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            メンバー（{party?.members.length ?? 0}名）
          </p>
          <div className="space-y-4">
            {(party?.members ?? []).map((memberId) => (
              <div
                key={memberId}
                className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-semibold text-sky-900">
                    {memberId.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{memberId}</p>
                    <p className="text-sm text-slate-600">
                      {memberId === party?.owner_id ? "主催者" : "参加者"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {memberId === party?.owner_id ? "主催者" : "参加者"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">招待リンク</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
              {inviteUrl || "招待リンクを取得中..."}
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              onClick={() => {
                if (inviteUrl) {
                  void navigator.clipboard.writeText(inviteUrl);
                }
              }}
            >
              コピー
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
