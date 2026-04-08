from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.core.database import db
from app.models.item import ItemCreate, ItemUpdate, StatusUpdate

router = APIRouter()


def _require_member(party_id: str, current_user: dict) -> dict:
    party = db.parties.find_one({"_id": ObjectId(party_id)})
    if not party:
        raise HTTPException(status_code=404, detail="パーティーが見つかりません")
    if str(current_user["_id"]) not in party["members"]:
        raise HTTPException(status_code=403, detail="参加者のみアクセスできます")
    return party


def _check_item_permission(item: dict, current_user: dict, party: dict):
    uid = str(current_user["_id"])
    if item["registered_by"] != uid and party["owner_id"] != uid:
        raise HTTPException(status_code=403, detail="権限がありません")


def _format_item(item: dict) -> dict:
    return {
        "id": str(item["_id"]),
        "party_id": item["party_id"],
        "name": item["name"],
        "category": item["category"],
        "quantity": item["quantity"],
        "registered_by": item["registered_by"],
        "status": item["status"],
    }


@router.get("/{party_id}/items", summary="アイテム一覧取得")
def list_items(party_id: str, current_user=Depends(get_current_user)):
    _require_member(party_id, current_user)
    items = list(db.items.find({"party_id": party_id}))
    return [_format_item(i) for i in items]


@router.post("/{party_id}/items", summary="アイテム追加")
def create_item(party_id: str, item: ItemCreate, current_user=Depends(get_current_user)):
    _require_member(party_id, current_user)
    new_item = {
        "party_id": party_id,
        "name": item.name,
        "category": item.category,
        "quantity": item.quantity,
        "registered_by": str(current_user["_id"]),
        "status": item.status,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = db.items.insert_one(new_item)
    return {"id": str(result.inserted_id), **_format_item({**new_item, "_id": result.inserted_id})}


@router.patch("/{party_id}/items/{item_id}", summary="アイテム編集（登録者または主催者のみ）")
def update_item(
    party_id: str,
    item_id: str,
    body: ItemUpdate,
    current_user=Depends(get_current_user),
):
    party = _require_member(party_id, current_user)
    item = db.items.find_one({"_id": ObjectId(item_id), "party_id": party_id})
    if not item:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    _check_item_permission(item, current_user, party)

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    db.items.update_one({"_id": ObjectId(item_id)}, {"$set": updates})
    return {"message": "更新成功"}


@router.patch("/{party_id}/items/{item_id}/status", summary="ステータス更新")
def update_status(
    party_id: str,
    item_id: str,
    body: StatusUpdate,
    current_user=Depends(get_current_user),
):
    _require_member(party_id, current_user)
    result = db.items.update_one(
        {"_id": ObjectId(item_id), "party_id": party_id},
        {"$set": {"status": body.status, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    return {"message": "更新成功"}


@router.delete("/{party_id}/items/{item_id}", summary="アイテム削除（登録者または主催者のみ）")
def delete_item(
    party_id: str,
    item_id: str,
    current_user=Depends(get_current_user),
):
    party = _require_member(party_id, current_user)
    item = db.items.find_one({"_id": ObjectId(item_id), "party_id": party_id})
    if not item:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    _check_item_permission(item, current_user, party)
    db.items.delete_one({"_id": ObjectId(item_id)})
    return {"message": "削除成功"}
