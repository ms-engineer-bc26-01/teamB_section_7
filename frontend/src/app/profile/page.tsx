import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-semibold text-slate-900">
            田
          </div>
          <p className="text-2xl font-semibold text-slate-950">田中 健太</p>
          <p className="mt-2 text-sm text-slate-600">tanaka@example.com</p>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              基本情報の変更
            </p>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            表示名
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue="田中 健太"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            メールアドレス
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              defaultValue="tanaka@example.com"
            />
          </label>
          <button
            className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
          >
            変更を保存
          </button>
        </div>

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              パスワード変更
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              現在のパスワード
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="password"
                placeholder="••••••••"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              新しいパスワード
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="password"
                placeholder="••••••••"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            確認
            <input
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
            />
          </label>
          <button
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            type="button"
          >
            パスワードを変更
          </button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-700">
                アカウントを削除
              </p>
              <p className="mt-1 text-sm text-slate-600">
                すべてのデータが削除されます。
              </p>
            </div>
            <button
              className="rounded-2xl border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
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
