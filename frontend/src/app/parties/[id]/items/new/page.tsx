"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

export default function NewItemPage() {
  const params = useParams<{ id: string }>();
  const partyId = params.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("料理");
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiRequest(`/api/parties/${partyId}/items`, {
        method: "POST",
        body: {
          name,
          category,
          quantity,
        },
      });
      router.push(`/parties/${partyId}/items`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アイテム追加に失敗しました",
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
            <p className="text-sm font-semibold text-slate-500">アイテム追加</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              アイテムを追加
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              パーティーID: {partyId}
            </p>
          </div>
          <Link
            href={`/parties/${partyId}/items`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← 戻る
          </Link>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 rounded-2xl bg-sky-50 p-5 text-sm text-slate-700">
            {""}
            このパーティーにアイテムを追加します。
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              品名 *
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="text"
                placeholder="例：唐揚げ、ビール、紙皿"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                カテゴリ *
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
                  type="text"
                  placeholder="例：4人前、2本"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </label>
            </div>
            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}
            <button
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "追加中..." : "追加する"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
