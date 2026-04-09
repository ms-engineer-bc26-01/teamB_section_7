import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function NewItemPage({ params }: Props) {
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
              パーティーID: {params.id}
            </p>
          </div>
          <Link
            href={`/parties/${params.id}/items`}
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
          <form className="space-y-6">
            <label className="block text-sm font-medium text-slate-700">
              品名 *
              <input
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                type="text"
                placeholder="例：唐揚げ、ビール、紙皿"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                カテゴリ *
                <select className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none">
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
                />
              </label>
            </div>
            <button
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
            >
              追加する
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
