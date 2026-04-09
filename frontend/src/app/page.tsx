import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] p-10 lg:p-14">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-900">
              <span>🎉</span>
              PotluckShareへようこそ
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                ホームパーティーの持ち寄りをみんなで共有
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                参加者と主催者が同じリストを見て、重複や抜け漏れのない準備を実現します。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                新規登録
              </Link>
            </div>
          </section>
          <section className="grid gap-4 sm:grid-cols-1">
            <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
              <div className="text-5xl">👀</div>
              <h2 className="mt-4 text-xl font-semibold">
                みんなの準備状況を一元管理
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                アイテムの担当者、数量、ステータスを一目で確認できます。
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-5xl">✅</div>
              <h2 className="mt-4 text-xl font-semibold">重複を防いで安心</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                参加者が何を持参するかが見える化され、重複や抜けを防ぎます。
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-5xl">🔗</div>
              <h2 className="mt-4 text-xl font-semibold">
                招待リンクでかんたん参加
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                URL ひとつで参加者を招待。ログイン済みならそのまま参加できます。
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
