import {
  test,
  expect,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const API_BASE_URL = "http://localhost:8000";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type PartyResponse = {
  id: string;
};

test.beforeEach(async ({ request }) => {
  const response = await request.post(`${API_BASE_URL}/api/test/reset-db`);

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `DB reset failed: ${response.status()} ${response.statusText()} ${body}`,
    );
  }
});

async function registerUser(
  request: APIRequestContext,
  email: string,
  displayName: string,
  password = "password123",
) {
  const response = await request.post(`${API_BASE_URL}/api/auth/register`, {
    data: {
      email,
      password,
      display_name: displayName,
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `User register failed: ${response.status()} ${response.statusText()} ${body}`,
    );
  }
}

async function loginApi(
  request: APIRequestContext,
  email: string,
  password = "password123",
): Promise<LoginResponse> {
  const response = await request.post(`${API_BASE_URL}/api/auth/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `API login failed: ${response.status()} ${response.statusText()} ${body}`,
    );
  }

  return (await response.json()) as LoginResponse;
}

async function createParty(
  request: APIRequestContext,
  accessToken: string,
): Promise<PartyResponse> {
  const response = await request.post(`${API_BASE_URL}/api/parties/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      title: "アイテムテスト用パーティー",
      date: "2026-05-01T10:00:00+09:00",
      memo: "E2E item test",
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `Create party failed: ${response.status()} ${response.statusText()} ${body}`,
    );
  }

  return (await response.json()) as PartyResponse;
}

async function gotoPartyItemsWithRetry(page: Page, partyId: string) {
  const targetUrl = `http://localhost:3000/parties/${partyId}/items`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(targetUrl);
      return;
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("interrupted by another navigation")
      ) {
        throw error;
      }

      // ログイン直後のダッシュボード遷移競合を吸収して再試行する。
      await page.waitForURL(/\/dashboard/);
    }
  }

  throw new Error(
    `Failed to navigate to items page after retries: ${targetUrl}`,
  );
}

test("E2E-03: アイテムを追加して一覧に表示される", async ({
  page,
  request,
}) => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const email = `item_user_${suffix}@example.com`;

  await registerUser(request, email, "アイテム担当");
  const login = await loginApi(request, email);
  const party = await createParty(request, login.access_token);
  const partyId = party.id;

  // 先にログイン
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByLabel("パスワード").fill("password123");
  await page.getByRole("button", { name: /ログイン/ }).click();

  // ログイン完了を待つ
  await expect(page).toHaveURL(/\/dashboard/);
  await page.waitForLoadState("networkidle");

  // アイテム一覧ページへ移動
  await gotoPartyItemsWithRetry(page, partyId);

  // アイテム追加画面へ移動
  await page.getByRole("link", { name: /アイテム追加/ }).click();

  // フォーム入力
  await page.getByPlaceholder("例：唐揚げ、ビール、紙皿").fill("唐揚げ");
  await page.getByRole("combobox").selectOption("料理");
  await page.getByPlaceholder("例：4人前、2本").fill("4人前");

  // 登録
  await page.getByRole("button", { name: "追加する" }).click();

  // 一覧画面に戻り、追加したアイテムが表示される
  await expect(page).toHaveURL(new RegExp(`/parties/${partyId}/items$`));
  await expect(page.getByText("唐揚げ")).toBeVisible();
});
