ffrom datetime import datetime, timedelta,timezone

from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.database import db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, settings.JWT_SECRET, algorithm="HS256")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    # 開発モード：認証スキップ（認可ロジックは引き続き動作）
    if settings.DEV_MODE:
        return {
            "_id": ObjectId("000000000000000000000001"),
            "email": "dev@example.com",
            "display_name": "Dev User",
        }

    # 未認証 → 401（HTTPBearerのauto_error=Falseにより403ではなく401を返す）
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="認証が必要です",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="認証情報が無効です",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="ユーザーが見つかりません")
        return user
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="トークンが無効です",
            headers={"WWW-Authenticate": "Bearer"},
        )
