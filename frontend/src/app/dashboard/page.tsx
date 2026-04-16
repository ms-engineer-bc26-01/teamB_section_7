"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { apiRequest } from "@/lib/api";
import { decodeJwtPayload, getAuthToken } from "@/lib/auth";
import { formatDateTimeInJst } from "@/lib/datetime";
import { Party, PartyStatus } from "@/lib/types";

export default function DashboardPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openedInvitePartyId, setOpenedInvitePartyId] = useState<string | null>(
    null,
  );
  const [origin, setOrigin] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const data = await apiRequest<Party[]>("/api/parties/");
        setParties(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "パーティー一覧の取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchParties();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setCurrentUserId(null);
      return;
    }
    const payload = decodeJwtPayload(token);
    setCurrentUserId(payload?.sub ?? null);
  }, []);

  const sortedParties = useMemo(
    () =>
      [...parties].sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        const aValid = Number.isFinite(aTime);
        const bValid = Number.isFinite(bTime);

        if (!aValid && !bValid) {
          return 0;
        }
        if (!aValid) {
          return 1;
        }
        if (!bValid) {
          return -1;
        }
        return aTime - bTime;
      }),
    [parties],
  );

  const handleStatusChange = async (partyId: string, status: PartyStatus) => {
    try {
      await apiRequest(`/api/parties/${partyId}`, {
        method: "PATCH",
        body: { status },
      });
      setParties((prev) =>
        prev.map((party) =>
          party.id === partyId ? { ...party, status } : party,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ステータス更新に失敗しました",
      );
    }
  };

  const handleDeleteParty = async (partyId: string) => {
    const ok = window.confirm("このパーティーを削除しますか？");
    if (!ok) {
      return;
    }

    try {
      await apiRequest(`/api/parties/${partyId}`, { method: "DELETE" });
      setParties((prev) => prev.filter((party) => party.id !== partyId));
      if (openedInvitePartyId === partyId) {
        setOpenedInvitePartyId(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "パーティー削除に失敗しました",
      );
    }
  };

  const handleCopyInviteLink = async (inviteToken: string) => {
    try {
      const inviteUrl = `${window.location.origin}/invite/${inviteToken}`;
      await navigator.clipboard.writeText(inviteUrl);
    } catch {
      setError("招待リンクのコピーに失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              ダッシュボード
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              マイパーティー
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              参加・主催しているパーティーの一覧です。
            </p>
          </div>
          <Link
            href="/parties/new"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ＋ 新規作成
          </Link>
        </div>

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-600">
            読み込み中...
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedParties.map((party) => {
              const isOwner = currentUserId === party.owner_id;

              return (
                <div
                  key={party.id}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link
                        href={`/parties/${party.id}/items`}
                        className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                      >
                        {party.title}
                      </Link>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {Number.isFinite(new Date(party.date).getTime())
                          ? formatDateTimeInJst(party.date)
                          : "日時未設定"}{" "}
                        / {party.members.length}
                        名参加
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${party.status === "終了" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-900"}`}
                    >
                      {party.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {party.memo ?? "メモはまだ登録されていません。"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isOwner && (
                      <>
                        <select
                          value={party.status}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                          onChange={(event) =>
                            void handleStatusChange(
                              party.id,
                              event.target.value as PartyStatus,
                            )
                          }
                        >
                          <option value="進行中">進行中</option>
                          <option value="終了">終了</option>
                        </select>
                        <Link
                          href={`/parties/${party.id}/settings`}
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          編集
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() =>
                        setOpenedInvitePartyId((prev) =>
                          prev === party.id ? null : party.id,
                        )
                      }
                    >
                      招待リンク表示
                    </button>
                    {isOwner && (
                      <button
                        type="button"
                        className="rounded-xl border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                        onClick={() => void handleDeleteParty(party.id)}
                      >
                        削除
                      </button>
                    )}
                  </div>
                  {openedInvitePartyId === party.id && (
                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="break-all">
                        {origin
                          ? `${origin}/invite/${party.invite_token}`
                          : `/invite/${party.invite_token}`}
                      </p>
                      <button
                        type="button"
                        className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        onClick={() =>
                          void handleCopyInviteLink(party.invite_token)
                        }
                      >
                        コピー
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/parties/new"
              className="flex items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ＋ 新しいパーティーを作成
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
