import { apiRequest } from "@/lib/api";
import { PartyByTokenResponse } from "@/lib/types";

interface JoinPartyResponse {
  message: string;
}

export async function getPartyByInviteToken(
  inviteToken: string,
): Promise<PartyByTokenResponse> {
  return apiRequest<PartyByTokenResponse>(
    `/api/parties/by-token?invite_token=${encodeURIComponent(inviteToken)}`,
    { useAuth: false },
  );
}

export async function joinPartyWithInviteToken(
  inviteToken: string,
): Promise<PartyByTokenResponse> {
  const party = await getPartyByInviteToken(inviteToken);

  await apiRequest<JoinPartyResponse>(`/api/parties/${party.id}/join`, {
    method: "POST",
    body: { invite_token: inviteToken },
  });

  return party;
}
