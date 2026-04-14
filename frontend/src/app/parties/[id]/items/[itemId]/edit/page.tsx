"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import { Item, ItemStatus, Party } from "@/lib/types";

export default function EditItemPage() {
  const params = useParams<{ id: string; itemId: string }>();
  const partyId = params.id;
  const itemId = params.itemId;
  const router = useRouter();

  const [party, setParty] = useState<Party | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("その他");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState<ItemStatus>("準備中");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partyData, items] = await Promise.all([
          apiRequest<Party>(`/api/parties/${partyId}`),
          apiRequest<Item[]>(`/api/parties/${partyId}/items`),
        ]);
        const targetItem =
          items.find((current) => current.id === itemId) ?? null;

        setParty(partyData);
        setItem(targetItem);

        if (targetItem) {
          setName(targetItem.name);
          setCategory(targetItem.category);
          setQuantity(targetItem.quantity);
          setStatus(targetItem.status);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの取得に失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (partyId && itemId) {
      void fetchData();
    }
  }, [partyId, itemId]);

  const itemTitle = useMemo(() => item?.name ?? "指定されたアイテム", [item]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await apiRequest(`/api/parties/${partyId}/items/${itemId}`, {
        method: "PATCH",
        body: {
          name,
          category,
          quantity,
          status,
        },
      });
      router.push(`/parties/${partyId}/items`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アイテム更新に失敗しました",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await apiRequest(`/api/parties/${partyId}/items/${itemId}`, {
        method: "DELETE",
      });
      router.push(`/parties/${partyId}/items`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アイテム削除に失敗しました",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">アイテム編集</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {itemTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {party?.title ?? "読み込み中..."}
            </p>
          </div>
          <Link
            href={`/parties/${partyId}/items`}
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
          <label className="block text-sm font-medium text-slate-700">
            品名 *
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              カテゴリ
              <select
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>料理</option>
                <option>飲み物</option>
                <option>デザート</option>
                <option>備品</option>
                <option>その他</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              数量・人数前
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            ステータス
            <select
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              value={status}
              onChange={(event) => setStatus(event.target.value as ItemStatus)}
            >
              <option>準備中</option>
              <option>完了</option>
            </select>
          </label>
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
              disabled={isSaving || isLoading}
            >
              {isSaving ? "保存中..." : "変更を保存"}
            </button>
            <button
              className="flex-1 rounded-2xl border border-rose-300 bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isLoading}
            >
              {isDeleting ? "削除中..." : "削除"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
