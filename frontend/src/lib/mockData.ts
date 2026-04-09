export const party = {
  id: "1",
  name: "田中家ホームパーティー",
  date: "4月15日（土）18:00〜",
  memberCount: 4,
  memo: "お菓子系のデザートも歓迎！",
  venue: "田中家リビング",
  inviteToken: "a3f9bc82-1d4e-...",
};

export const members = [
  {
    name: "田中 健太",
    role: "主催者",
    initials: "田",
    color: "bg-indigo-100 text-indigo-900",
  },
  {
    name: "山田 花子",
    role: "参加者",
    initials: "山",
    color: "bg-emerald-100 text-emerald-900",
  },
  {
    name: "鈴木 一郎",
    role: "参加者",
    initials: "鈴",
    color: "bg-amber-100 text-amber-900",
  },
  {
    name: "佐藤 美咲",
    role: "参加者",
    initials: "佐",
    color: "bg-pink-100 text-pink-900",
  },
];

export const items = [
  {
    id: "1",
    name: "唐揚げ",
    category: "料理",
    qty: "4人前",
    owner: "田中 健太",
    status: "準備中",
  },
  {
    id: "2",
    name: "ポテトサラダ",
    category: "料理",
    qty: "3人前",
    owner: "山田 花子",
    status: "準備中",
  },
  {
    id: "3",
    name: "ビール",
    category: "飲み物",
    qty: "12本",
    owner: "鈴木 一郎",
    status: "完了",
  },
  {
    id: "4",
    name: "ソフトドリンク",
    category: "飲み物",
    qty: "各2本",
    owner: "佐藤 美咲",
    status: "準備中",
  },
  {
    id: "5",
    name: "紙皿・コップ",
    category: "備品",
    qty: "20セット",
    owner: "田中 健太",
    status: "完了",
  },
  {
    id: "6",
    name: "チーズケーキ",
    category: "デザート",
    qty: "1ホール",
    owner: "山田 花子",
    status: "準備中",
  },
];

export const categories = ["料理", "飲み物", "デザート", "備品", "その他"];
