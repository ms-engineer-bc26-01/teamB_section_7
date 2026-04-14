import { test, expect } from '@playwright/test';

test('E2E-03: アイテムを追加して一覧に表示される', async ({ page }) => {
  const partyId = '69de60a26c612c9588d0026f';

  // 先にログイン
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('メールアドレス').fill('test@example.com');
  await page.getByLabel('パスワード').fill('password123');
  await page.getByRole('button', { name: /ログイン/ }).click();

  // ログイン完了を待つ
  await expect(page).toHaveURL(/\/dashboard/);

  // アイテム一覧ページへ移動
  await page.goto(`http://localhost:3000/parties/${partyId}/items`);

  // アイテム追加画面へ移動
  await page.getByRole('link', { name: /アイテム追加/ }).click();

  // フォーム入力
  await page.getByPlaceholder('例：唐揚げ、ビール、紙皿').fill('唐揚げ');
  await page.getByRole('combobox').selectOption('料理');
  await page.getByPlaceholder('例：4人前、2本').fill('4人前');

  // 登録
  await page.getByRole('button', { name: '追加する' }).click();

  // 一覧画面に戻り、追加したアイテムが表示される
  await expect(page).toHaveURL(new RegExp(`/parties/${partyId}/items$`));
  await expect(page.getByText('唐揚げ')).toBeVisible();
});
