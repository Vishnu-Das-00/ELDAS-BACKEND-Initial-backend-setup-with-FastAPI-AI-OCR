from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "Eldas Backend"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    secret_key: str
    access_token_expire_minutes: int = 60
    database_url: str
    allowed_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    local_storage_path: Path = Path("storage")
    media_base_url: str = "/media"
    storage_backend: str = "local"

    s3_bucket: str | None = None
    s3_region: str | None = None
    s3_access_key_id: str | None = None
    s3_secret_access_key: str | None = None

    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"

    ocr_provider: str = "tesseract"
    tesseract_cmd: str | None = None

    weak_score_threshold: float = 0.5

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_use_tls: bool = True


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.local_storage_path.mkdir(parents=True, exist_ok=True)
    return settings