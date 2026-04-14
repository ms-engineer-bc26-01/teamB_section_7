import { getAuthToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  useAuth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, useAuth = true, ...rest } = options;
  const nextHeaders = new Headers(headers);

  if (body !== undefined) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (useAuth) {
    const token = getAuthToken();
    if (token) {
      nextHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: nextHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail = "通信に失敗しました";

    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        detail = data.detail;
      }
    } catch {
      // Fall back to default message when response body is not JSON.
    }

    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
