import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.post(
    "http://localhost:8000/api/test/reset-db",
  );

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `DB reset failed: ${response.status()} ${response.statusText()} ${body}`,
    );
  }
});

test("E2E-01: 新規登録からダッシュボードへ", async ({ page }) => {
  const email = `test_${Date.now()}@example.com`;

  await page.goto("http://localhost:3000/register");

  await page.fill("#display_name", "テストユーザー");
  await page.fill("#email", email);
  await page.fill("#password", "password123");
  await page.fill("#confirm_password", "password123");
  await page.click('button[type="submit"]');

  // 登録後、そのままダッシュボードに遷移することを確認
  await expect(page).toHaveURL(/\/dashboard/);
});
