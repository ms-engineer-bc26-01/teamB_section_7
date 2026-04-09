import Link from "next/link";

export default function NewPartyPage() {
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
          <form className="space-y-6">
            <label className="block text-sm font-medium text-slate-700">
              パーティー名 *
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="text"
                placeholder="例：田中家ホームパーティー"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                開催日
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                  type="date"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                開始時間
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                  type="time"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              メモ（任意）
              <textarea
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                rows={4}
                placeholder="テーマや注意点など"
              />
            </label>
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
              作成後に招待リンクが発行されます。
            </div>
            <button
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
            >
              作成して招待リンクを発行
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
