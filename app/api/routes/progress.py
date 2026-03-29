from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.schemas.progress import ProgressResponse
from app.services.progress_service import ProgressService

router = APIRouter()
progress_service = ProgressService()


@router.get("/{student_id}", response_model=list[ProgressResponse])
def get_progress(
    student_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> list[ProgressResponse]:
    return progress_service.get_student_progress(db, current_user, student_id)
