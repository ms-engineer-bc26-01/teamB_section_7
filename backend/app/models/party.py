from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PartyCreate(BaseModel):
    title: str
    date: datetime
    memo: Optional[str] = None


class PartyResponse(BaseModel):
    id: str
    title: str
    date: datetime
    memo: Optional[str]
    owner_id: str
    invite_token: str
    members: list[str]


class JoinRequest(BaseModel):
    invite_token: str
