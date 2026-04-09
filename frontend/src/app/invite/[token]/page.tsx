import Link from "next/link";

interface Props {
  params: { token: string };
}

export default function InvitePage({ params }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
        <div className="mb-6 text-center">
          <div className="mb-4 text-5xl">🎊</div>
          <p className="text-2xl font-semibold">招待を受け取りました</p>
          <p className="mt-3 text-sm text-slate-600">
            田中家ホームパーティーへの招待です。
          </p>
        </div>
        <div className="mb-6 rounded-3xl bg-slate-50 p-5 text-left text-sm text-slate-700">
          <p className="font-semibold text-slate-900">招待パーティー</p>
          <p className="mt-2 text-base font-semibold text-slate-950">
            田中家ホームパーティー
          </p>
          <p className="mt-1 text-sm text-slate-600">
            4月15日（土）18:00〜 / 4名参加
          </p>
          <p className="mt-3 break-all text-xs text-slate-500">
            招待トークン: {params.token}
          </p>
        </div>
        <Link
          href="/login"
          className="mb-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          ログインして参加する
        </Link>
        <Link
          href="/register"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          新規登録して参加する
        </Link>
      </div>
    </main>
  );
}
