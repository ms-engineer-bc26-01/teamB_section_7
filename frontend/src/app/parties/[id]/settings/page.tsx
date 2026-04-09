import Link from "next/link";
import { party } from "@/lib/mockData";

interface Props {
  params: { id: string };
}

export default function SettingsPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              パーティー設定
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {party.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              パーティーID: {params.id}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            ← 戻る
          </Link>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">基本情報</p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            パーティー名
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue={party.name}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              日付
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                defaultValue="2026-04-15"
                type="date"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              開始時間
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                defaultValue="18:00"
                type="time"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            メモ
            <textarea
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              rows={3}
              defaultValue={party.memo}
            />
          </label>
          <button
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
          >
            変更を保存
          </button>
        </div>

        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 shadow-sm">
          <p className="text-sm font-semibold text-rose-700">危険ゾーン</p>
          <p className="mt-3 text-sm text-rose-700/80">
            パーティーを削除すると、すべてのアイテムと参加者情報が削除されます。
          </p>
          <button
            className="mt-6 rounded-2xl border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            type="button"
          >
            このパーティーを削除する
          </button>
        </div>
      </div>
    </main>
  );
}
