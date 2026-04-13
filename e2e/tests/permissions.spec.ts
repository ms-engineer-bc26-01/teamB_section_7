import { test, expect } from '@playwright/test';

// 仮のログイン関数（後で実装・差し替え）
async function loginAs(page, email, password) {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

test('E2E-05: 参加者が主催者専用画面にアクセスできない', async ({ page }) => {
  // 参加者ロールでログインする
  await loginAs(page, 'member@example.com', 'password123');

  // 主催者専用画面にアクセスを試みる
  await page.goto('http://localhost:3000/parties/TEST_PARTY_ID/settings');

  // 403 ページまたはリダイレクトされることを確認
  await expect(page.locator('text=アクセス権限がありません')).toBeVisible();
});