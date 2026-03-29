from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.db import get_db_session
from app.schemas.submission import SubmissionResponse
from app.services.submission_service import SubmissionService

router = APIRouter()
submission_service = SubmissionService()


@router.post("/upload", response_model=SubmissionResponse, status_code=201)
async def upload_submission(
    background_tasks: BackgroundTasks,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
    test_id: int = Form(...),
    answer_text: str | None = Form(default=None),
    image_file: UploadFile | None = File(default=None),
) -> SubmissionResponse:
    return await submission_service.create_submission(
        db,
        background_tasks,
        current_user,
        test_id=test_id,
        answer_text=answer_text,
        image_file=image_file,
    )


@router.get("/{student_id}", response_model=list[SubmissionResponse])
def get_student_submissions(
    student_id: int,
    db: Annotated[Session, Depends(get_db_session)],
    current_user=Depends(get_current_user),
) -> list[SubmissionResponse]:
    return submission_service.list_submissions_for_student(db, current_user, student_id)
