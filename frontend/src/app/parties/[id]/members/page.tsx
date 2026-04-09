import Link from "next/link";
import { members, party } from "@/lib/mockData";

interface Props {
  params: { id: string };
}

export default function MembersPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-500">参加者管理</p>
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

        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            メンバー（{members.length}名）
          </p>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${member.color} text-lg font-semibold`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">
                      {member.name}
                    </p>
                    <p className="text-sm text-slate-600">{member.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">招待リンク</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
              https://potluck.app/invite/{party.inviteToken}
            </div>
            <button className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              コピー
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
