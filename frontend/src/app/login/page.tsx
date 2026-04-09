import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">🔑</div>
          <p className="text-2xl font-semibold">ログイン</p>
          <p className="mt-2 text-sm text-slate-600">
            アカウントでログインして続行してください。
          </p>
        </div>
        <form className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            メールアドレス
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="email"
              placeholder="example@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            パスワード
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
              type="password"
              placeholder="••••••••"
            />
          </label>
          <button
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="submit"
          >
            ログイン
          </button>
          <div className="text-center text-sm text-slate-600">
            アカウントをお持ちでないですか？{" "}
            <Link
              href="/register"
              className="font-semibold text-slate-900 hover:underline"
            >
              新規登録
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
