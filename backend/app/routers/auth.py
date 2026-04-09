from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.core.auth import create_access_token, hash_password, verify_password
from app.core.database import db
from app.models.user import UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post(
    "/register",
    summary="新規ユーザー登録",
    description="メールアドレスとパスワードで新規登録する。メールは一意制。",
    response_model=UserResponse,
    responses={400: {"description": "メール重複"}},
)
def register(user: UserCreate):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="このメールアドレスはすでに登録されています")

    hashed = hash_password(user.password)
    result = db.users.insert_one(
        {
            "email": user.email,
            "password_hash": hashed,
            "display_name": user.display_name,
            "created_at": datetime.utcnow(),
        }
    )
    return UserResponse(
        id=str(result.inserted_id),
        email=user.email,
        display_name=user.display_name,
    )


@router.post(
    "/login",
    summary="ログイン・JWT発行",
    description="メールアドレスとパスワードで認証し、JWTアクセストークンを返す。",
    responses={401: {"description": "認証失敗"}},
)
def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=401, detail="メールアドレスまたはパスワードが正しくありません"
        )
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer"}
