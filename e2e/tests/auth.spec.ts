import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // テスト前にテスト用 DB をリセット
});

test('E2E-01: 新規登録からダッシュボードへ', async ({ page }) => {
  const email = `test_${Date.now()}@example.com`;

  await page.goto('http://localhost:3000/register');

  await page.fill('input[name="displayName"]', 'テストユーザー');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="passwordConfirm"]', 'password123');
  await page.click('button[type="submit"]');

  // ログイン画面に遷移したことを確認
  await expect(page).toHaveURL(/\/login/);

  // ログイン
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // ダッシュボードに遷移したことを確認
  await expect(page).toHaveURL(/\/dashboard/);
});