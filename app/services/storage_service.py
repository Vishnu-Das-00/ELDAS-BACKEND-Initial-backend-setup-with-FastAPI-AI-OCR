from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

import boto3

from app.core.config import get_settings


@dataclass
class StoredFile:
    url: str
    absolute_path: Path | None


class StorageService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def save_submission_image(self, *, filename: str | None, content: bytes) -> StoredFile:
        suffix = Path(filename or "upload.bin").suffix or ".bin"
        generated_name = f"{uuid4().hex}{suffix}"
        relative_key = Path("uploads") / "submissions" / generated_name
        if self.settings.storage_backend.lower() == "s3":
            return self._save_to_s3(relative_key.as_posix(), content)
        return self._save_to_local(relative_key, content)

    def _save_to_local(self, relative_key: Path, content: bytes) -> StoredFile:
        absolute_path = self.settings.local_storage_path / relative_key
        absolute_path.parent.mkdir(parents=True, exist_ok=True)
        absolute_path.write_bytes(content)
        return StoredFile(url=f"{self.settings.media_base_url}/{relative_key.as_posix()}", absolute_path=absolute_path)

    def _save_to_s3(self, key: str, content: bytes) -> StoredFile:
        if not self.settings.s3_bucket:
            raise ValueError("S3 bucket is not configured.")

        client = boto3.client(
            "s3",
            region_name=self.settings.s3_region,
            aws_access_key_id=self.settings.s3_access_key_id,
            aws_secret_access_key=self.settings.s3_secret_access_key,
        )
        client.put_object(Bucket=self.settings.s3_bucket, Key=key, Body=content)
        region = self.settings.s3_region or "us-east-1"
        url = f"https://{self.settings.s3_bucket}.s3.{region}.amazonaws.com/{key}"
        return StoredFile(url=url, absolute_path=None)
