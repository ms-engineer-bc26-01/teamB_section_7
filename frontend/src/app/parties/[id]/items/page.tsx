"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { formatDateTimeInJst } from "@/lib/datetime";
import { Item, Party } from "@/lib/types";

export default function ItemsPage() {
  const params = useParams<{ id: string }>();
  const partyId = params.id;

  const [party, setParty] = useState<Party | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partyData, itemData] = await Promise.all([
          apiRequest<Party>(`/api/parties/${partyId}`),
          apiRequest<Item[]>(`/api/parties/${partyId}/items`),
        ]);
        setParty(partyData);
        setItems(itemData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (partyId) {
      void fetchData();
    }
  }, [partyId]);

  const total = items.length;
  const done = useMemo(
    () => items.filter((item) => item.status === "完了").length,
    [items],
  );
  const prep = total - done;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {party?.title ?? "パーティー"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              アイテム一覧
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {party
                ? `${formatDateTimeInJst(party.date)} / ${party.members.length}名参加`
                : "読み込み中..."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/parties/${partyId}/items/new`}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              ＋ アイテム追加
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              ダッシュボードへ
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">総アイテム</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">
              {total}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">完了</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{done}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">準備中</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{prep}</p>
          </div>
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
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4">品名</th>
                  <th className="px-5 py-4">カテゴリ</th>
                  <th className="px-5 py-4">数量</th>
                  <th className="px-5 py-4">担当者</th>
                  <th className="px-5 py-4">ステータス</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.registered_by_name}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === "完了" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/parties/${partyId}/items/${item.id}/edit`}
                        className="rounded-2xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        編集
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
