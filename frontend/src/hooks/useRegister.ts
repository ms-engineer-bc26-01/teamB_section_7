"use client";

import { useCallback } from "react";
import { RegisterInput } from "@/lib/validations/auth";

export function useRegister() {
  const register = useCallback(async (data: RegisterInput) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("登録に失敗しました");
    }

    return res.json();
  }, []);

  return { register };
}
