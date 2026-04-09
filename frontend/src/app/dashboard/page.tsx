import Link from "next/link";

const parties = [
  {
    id: "1",
    name: "田中家ホームパーティー",
    subtitle: "4月15日（土）18:00〜 / 4名参加",
    description: "持ち寄りリストを共有して、準備の重複を防ぎます。",
  },
  {
    id: "2",
    name: "山田家焼き肉会",
    subtitle: "4月22日（土）19:00〜 / 6名参加",
    description: "飲み物とデザートの担当を分担します。",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              ダッシュボード
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              マイパーティー
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              参加・主催しているパーティーの一覧です。
            </p>
          </div>
          <Link
            href="/parties/new"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ＋ 新規作成
          </Link>
        </div>

        <div className="grid gap-6">
          {parties.map((party) => (
            <Link
              key={party.id}
              href={`/parties/${party.id}/items`}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {party.name}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {party.subtitle}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  進行中
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {party.description}
              </p>
            </Link>
          ))}
          <Link
            href="/parties/new"
            className="flex items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ＋ 新しいパーティーを作成
          </Link>
        </div>
      </div>
    </main>
  );
}
