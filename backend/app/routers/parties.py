import uuid
from datetime import datetime, timezone  # ← timezone を追加

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.core.database import db
from app.models.party import JoinRequest, PartyCreate, PartyUpdate

router = APIRouter()


def _format_party(party: dict) -> dict:
    return {
        "id": str(party["_id"]),
        "title": party["title"],
        "date": party["date"],
        "memo": party.get("memo"),
        "owner_id": party["owner_id"],
        "invite_token": party["invite_token"],
        "members": party["members"],
    }


@router.get("/", summary="自分のパーティー一覧取得")
def list_parties(current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    parties = list(db.parties.find({"members": user_id}))
    return [_format_party(p) for p in parties]


@router.post("/", summary="パーティー新規作成")
def create_party(party: PartyCreate, current_user=Depends(get_current_user)):
    new_party = {
        "title": party.title,
        "date": party.date,
        "memo": party.memo,
        "owner_id": str(current_user["_id"]),
        "invite_token": str(uuid.uuid4()),
        "members": [str(current_user["_id"])],
        "created_at": datetime.now(timezone.utc),
    }
    result = db.parties.insert_one(new_party)
    return {"id": str(result.inserted_id), **_format_party({**new_party, "_id": result.inserted_id})}


@router.get("/{party_id}", summary="パーティー詳細取得")
def get_party(party_id: str, current_user=Depends(get_current_user)):
    party = db.parties.find_one({"_id": ObjectId(party_id)})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if str(current_user["_id"]) not in party["members"]:
        raise HTTPException(status_code=403, detail="このパーティーへのアクセス権がありません")
    return _format_party(party)


@router.patch("/{party_id}", summary="パーティー情報更新（主催者のみ）")
def update_party(party_id: str, party: PartyUpdate, current_user=Depends(get_current_user)):
    existing = db.parties.find_one({"_id": ObjectId(party_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if existing["owner_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="主催者のみ実行できます")
    updates = {k: v for k, v in party.model_dump().items() if v is not None}
    db.parties.update_one({"_id": ObjectId(party_id)}, {"$set": updates})
    return {"message": "更新成功"}


@router.delete("/{party_id}", summary="パーティー削除（主催者のみ）")
def delete_party(party_id: str, current_user=Depends(get_current_user)):
    existing = db.parties.find_one({"_id": ObjectId(party_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if existing["owner_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="主催者のみ実行できます")
    db.parties.delete_one({"_id": ObjectId(party_id)})
    db.items.delete_many({"party_id": party_id})
    return {"message": "削除成功"}


@router.post("/{party_id}/join", summary="招待トークンでパーティー参加")
def join_party(party_id: str, token_body: JoinRequest, current_user=Depends(get_current_user)):
    party = db.parties.find_one(
        {"_id": ObjectId(party_id), "invite_token": token_body.invite_token}
    )
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    user_id = str(current_user["_id"])
    if user_id in party["members"]:
        raise HTTPException(status_code=409, detail="すでに参加済みです")
    db.parties.update_one({"_id": ObjectId(party_id)}, {"$push": {"members": user_id}})
    return {"message": "参加成功"}

