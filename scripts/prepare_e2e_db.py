from pathlib import Path
import shutil

import app.models.classroom  # noqa: F401
import app.models.evaluation  # noqa: F401
import app.models.notification  # noqa: F401
import app.models.progress  # noqa: F401
import app.models.submission  # noqa: F401
import app.models.test  # noqa: F401
import app.models.user  # noqa: F401
from app.core.config import get_settings
from app.db.session import engine
from app.models.base import Base


def main() -> None:
    settings = get_settings()
    database_url = settings.database_url

    if not database_url.startswith("sqlite:///"):
        raise SystemExit("E2E database bootstrap expects a sqlite database URL.")

    db_path = Path(database_url.removeprefix("sqlite:///"))
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if db_path.exists():
        db_path.unlink()

    storage_path = settings.local_storage_path
    if storage_path.exists():
        shutil.rmtree(storage_path)
    storage_path.mkdir(parents=True, exist_ok=True)

    Base.metadata.create_all(bind=engine)
    print(f"E2E database prepared at {db_path}")


if __name__ == "__main__":
    main()
