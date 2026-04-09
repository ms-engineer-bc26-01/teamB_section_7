import Link from "next/link";
import { items, party } from "@/lib/mockData";

interface Props {
  params: { id: string; itemId: string };
}

export default function EditItemPage({ params }: Props) {
  const item = items.find((item) => item.id === params.itemId) ?? {
    name: "指定されたアイテム",
    category: "その他",
    qty: "-",
    status: "準備中",
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">アイテム編集</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {item.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{party.name}</p>
          </div>
          <Link
            href={`/parties/${params.id}/items`}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← 戻る
          </Link>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <label className="block text-sm font-medium text-slate-700">
            品名 *
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue={item.name}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              カテゴリ
              <select
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                defaultValue={item.category}
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
                defaultValue={item.qty}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            ステータス
            <select
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue={item.status}
            >
              <option>準備中</option>
              <option>完了</option>
            </select>
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="button"
            >
              変更を保存
            </button>
            <button
              className="flex-1 rounded-2xl border border-rose-300 bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
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
