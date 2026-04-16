from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.core.database import db

router = APIRouter()


@router.post(
    "/reset-db",
    summary="E2E テスト用 DB リセット",
    description=(
        "E2E テスト実行前に users/parties/items コレクションを初期化する。"
        "安全のため DEV_MODE=true または test DB 接続時のみ実行できる。"
    ),
)
def reset_db():
    if not settings.DEV_MODE and "test" not in settings.MONGO_URI.lower():
        raise HTTPException(
            status_code=403,
            detail="DB リセットは DEV_MODE=true または test DB 接続時のみ許可されています",
        )

    db.users.delete_many({})
    db.parties.delete_many({})
    db.items.delete_many({})

    return {"ok": True}
