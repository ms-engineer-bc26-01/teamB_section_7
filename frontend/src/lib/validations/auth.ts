import { z } from "zod";

export const registerSchema = z
  .object({
    display_name: z.string().min(1, "表示名を入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(8, "パスワードは8文字以上です"),
    confirm_password: z.string().min(8, "パスワード確認を入力してください"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "パスワードと確認が一致しません",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
