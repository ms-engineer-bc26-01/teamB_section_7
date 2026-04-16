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
  invite_token: string;
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

async function loginAs(page: Page, email: string, password: string) {
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByLabel("パスワード").fill(password);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.waitForLoadState("networkidle");
}

async function gotoWithRetry(page: Page, url: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(url);
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
  throw new Error(`Failed to navigate to ${url} after retries`);
}

test("E2E-05: 参加者が主催者専用画面にアクセスできない", async ({
  page,
  request,
}) => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const ownerEmail = `owner_${suffix}@example.com`;
  const memberEmail = `member_${suffix}@example.com`;

  await registerUser(request, ownerEmail, "主催者");
  await registerUser(request, memberEmail, "参加者");

  const ownerLogin = await loginApi(request, ownerEmail);
  const createPartyResponse = await request.post(
    `${API_BASE_URL}/api/parties/`,
    {
      headers: {
        Authorization: `Bearer ${ownerLogin.access_token}`,
      },
      data: {
        title: "権限テストパーティー",
        date: "2026-05-01T10:00:00+09:00",
        memo: "E2E permission test",
      },
    },
  );

  if (!createPartyResponse.ok()) {
    const body = await createPartyResponse.text();
    throw new Error(
      `Create party failed: ${createPartyResponse.status()} ${createPartyResponse.statusText()} ${body}`,
    );
  }

  const party = (await createPartyResponse.json()) as PartyResponse;
  const memberLogin = await loginApi(request, memberEmail);
  const joinResponse = await request.post(
    `${API_BASE_URL}/api/parties/${party.id}/join`,
    {
      headers: {
        Authorization: `Bearer ${memberLogin.access_token}`,
      },
      data: {
        invite_token: party.invite_token,
      },
    },
  );

  if (!joinResponse.ok()) {
    const body = await joinResponse.text();
    throw new Error(
      `Join party failed: ${joinResponse.status()} ${joinResponse.statusText()} ${body}`,
    );
  }

  await loginAs(page, memberEmail, "password123");

  // 主催者専用画面にアクセスを試みる
  await gotoWithRetry(
    page,
    `http://localhost:3000/parties/${party.id}/settings`,
  );

  // 参加者は設定画面を操作できず、権限エラー表示となることを確認
  await expect(page.getByText("アクセス権限がありません")).toBeVisible();
  await expect(
    page.getByText("この画面は主催者のみ利用できます。"),
  ).toBeVisible();
});
