from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ItemStatus(str, Enum):
    preparing = "準備中"
    done = "完了"


class ItemCreate(BaseModel):
    name: str
    category: str
    quantity: str
    status: ItemStatus = ItemStatus.preparing


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[str] = None
    status: Optional[ItemStatus] = None


class StatusUpdate(BaseModel):
    status: ItemStatus


class ItemResponse(BaseModel):
    id: str
    party_id: str
    name: str
    category: str
    quantity: str
    registered_by: str
    status: ItemStatus
