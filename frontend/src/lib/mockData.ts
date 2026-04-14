interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export const party = {
  id: "1",
  name: "田中家ホームパーティー",
  date: "4月15日（土）18:00〜",
  memberCount: 4,
  memo: "お菓子系のデザートも歓迎！",
  venue: "田中家リビング",
  inviteToken: "a3f9bc82-1d4e-...",
};

export const members: Member[] = [
  {
    id: "1",
    name: "田中 健太",
    role: "主催者",
    initials: "田",
    color: "bg-indigo-100 text-indigo-900",
  },
  {
    id: "2",
    name: "山田 花子",
    role: "参加者",
    initials: "山",
    color: "bg-emerald-100 text-emerald-900",
  },
  {
    id: "3",
    name: "鈴木 一郎",
    role: "参加者",
    initials: "鈴",
    color: "bg-amber-100 text-amber-900",
  },
  {
    id: "4",
    name: "佐藤 美咲",
    role: "参加者",
    initials: "佐",
    color: "bg-pink-100 text-pink-900",
  },
];

export const items = [
  // ...
];

export const categories = ["料理", "飲み物", "デザート", "備品", "その他"];
