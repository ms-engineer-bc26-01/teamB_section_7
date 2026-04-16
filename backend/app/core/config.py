from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        # 実際の環境変数が .env ファイルより優先される（デフォルト動作を明示）
        case_sensitive=False,
    )

    MONGO_URI: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60
    DEV_MODE: bool = False


settings = Settings()
