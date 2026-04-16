export type ItemStatus = "準備中" | "完了";
export type PartyStatus = "進行中" | "終了";

export interface User {
  id: string;
  email: string;
  display_name: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface Party {
  id: string;
  title: string;
  date: string;
  memo?: string | null;
  status: PartyStatus;
  owner_id: string;
  invite_token: string;
  members: string[];
}

export interface PartyByTokenResponse {
  id: string;
  title: string;
  date: string;
  memo?: string | null;
  member_count: number;
}

export interface Item {
  id: string;
  party_id: string;
  name: string;
  category: string;
  quantity: string;
  registered_by: string;
  registered_by_name: string;
  status: ItemStatus;
}

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
}
