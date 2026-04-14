"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearAuth, getCurrentUser } from "@/lib/auth";

export default function Navbar() {
  const [displayName, setDisplayName] = useState("未ログイン");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setDisplayName(user.display_name || user.email);
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10 lg:px-16">
        <Link href="/" className="text-base font-semibold text-slate-900">
          PotluckShare
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/profile" className="text-slate-600 hover:text-slate-900">
            {displayName}
          </Link>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => {
              clearAuth();
              window.location.href = "/login";
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
