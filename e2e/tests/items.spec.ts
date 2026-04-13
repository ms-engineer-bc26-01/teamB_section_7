import { test, expect } from '@playwright/test';

test('E2E-03: アイテムを追加して一覧に表示される', async ({ page }) => {
  // 事前にログインしてパーティーに参加する状態にする
  await page.goto('http://localhost:3000/parties/TEST_PARTY_ID/items');

  // アイテム追加ボタンをクリック
  await page.click('text=アイテムを追加');

  // フォーム入力
  await page.fill('input[name="name"]', '唐揚げ');
  await page.selectOption('select[name="category"]', '料理');
  await page.fill('input[name="quantity"]', '4人前');
  await page.click('button[type="submit"]');

  // 一覧画面に戻り、追加したアイテムが表示される
  await expect(page).toHaveURL(/\/items$/);
  await expect(page.locator('text=唐揚げ')).toBeVisible();
});